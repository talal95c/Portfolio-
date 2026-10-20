from pathlib import Path
from PIL import Image, ImageChops, ImageStat
import hashlib
import json
import math
import statistics


ROOT = Path(__file__).resolve().parents[1]
STATIC = ROOT / "static"
WORK = STATIC / "work"
MANIFEST = ROOT / "src" / "lib" / "data" / "media.js"
TOLERANCE = 6
MIN_BAND = 8
LINEAR = tuple(
    value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4
    for value in (index / 255 for index in range(256))
)


def median_color(edge):
    return tuple(round(value) for value in ImageStat.Stat(edge).median[:3])


def matches_color(image, side, index, color):
    width, height = image.size
    if side in ("top", "bottom"):
        strip = image.crop((0, index, width, index + 1))
    else:
        strip = image.crop((index, 0, index + 1, height))

    return all(
        low >= channel - TOLERANCE and high <= channel + TOLERANCE
        for (low, high), channel in zip(ImageStat.Stat(strip).extrema, color)
    )


def edge_band(image, side):
    width, height = image.size
    horizontal = side in ("top", "bottom")
    length = height if horizontal else width
    edge_index = 0 if side in ("top", "left") else length - 1
    if horizontal:
        edge = image.crop((0, edge_index, width, edge_index + 1))
    else:
        edge = image.crop((edge_index, 0, edge_index + 1, height))
    color = median_color(edge)

    band = 0
    for offset in range(length):
        index = offset if side in ("top", "left") else length - offset - 1
        if not matches_color(image, side, index, color):
            break
        band += 1
    return band if band >= MIN_BAND else 0


def trim_counts(image):
    top = edge_band(image, "top")
    bottom = edge_band(image, "bottom")
    left = edge_band(image, "left")
    right = edge_band(image, "right")
    width, height = image.size
    if top + bottom >= height:
        top = bottom = 0
    if left + right >= width:
        left = right = 0
    return top, bottom, left, right


def mean_relative_luminance(image):
    width, height = image.size
    top = image.crop((0, 0, width, max(1, math.ceil(height * 0.25))))
    histogram = top.histogram()
    pixel_count = top.width * top.height
    channels = [
        sum(LINEAR[value] * count for value, count in enumerate(histogram[offset : offset + 256]))
        / pixel_count
        for offset in (0, 256, 512)
    ]
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]


def public_path(path):
    return "/" + path.relative_to(STATIC).as_posix()


def card_crop(image):
    width, height = image.size
    corners = [
        image.getpixel(point)
        for point in ((0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1))
    ]
    agreement = max(
        max(abs(corners[first][channel] - corners[second][channel]) for channel in range(3))
        for first in range(4)
        for second in range(first + 1, 4)
    )
    if agreement > 8:
        return image.copy(), None

    frame = tuple(round(statistics.median(corner[channel] for corner in corners)) for channel in range(3))
    difference = ImageChops.difference(image, Image.new("RGB", image.size, frame))
    mask = ImageChops.lighter(
        ImageChops.lighter(difference.getchannel("R"), difference.getchannel("G")),
        difference.getchannel("B"),
    ).point(lambda value: 255 if value > 30 else 0)
    bounds = mask.getbbox()
    if bounds is None:
        return image.copy(), (frame, None, 0)

    left, top, right, bottom = bounds
    inset = round(0.03 * min(right - left, bottom - top))
    crop = (left + inset, top + inset, right - inset, bottom - inset)
    if crop[2] <= crop[0] or crop[3] <= crop[1]:
        return image.copy(), (frame, bounds, 0)
    return image.crop(crop), (frame, bounds, inset)


def main():
    manifest = {}
    sources = sorted(
        path
        for path in WORK.rglob("*")
        if path.is_file() and path.stem.rsplit("_", 1)[-1] not in {"trim", "card"}
    )

    for path in sources:
        try:
            with Image.open(path) as source:
                image = source.convert("RGB")
        except (OSError, ValueError):
            continue

        if path.stem.endswith("_poster"):
            top = bottom = left = right = 0
            output_path = path
        else:
            top, bottom, left, right = trim_counts(image)
            output_path = path
            if top or bottom or left or right:
                output_path = path.with_name(f"{path.stem}_trim.webp")
                image.crop((left, top, image.width - right, image.height - bottom)).save(
                    output_path,
                    "WEBP",
                    quality=90,
                    method=6,
                )

        with Image.open(output_path) as result:
            result = result.convert("RGB")
            width, height = result.size
            luminance = mean_relative_luminance(result)
            tone = "dark" if luminance < 0.5 else "light"

        if path.stem.endswith("_poster"):
            card_path = path
            card = image
            frame_info = "poster"
        else:
            card, frame_info = card_crop(image)
            card_path = path.with_name(f"{path.stem}_card.webp")
            card.save(card_path, "WEBP", quality=90, method=6)

        source_url = public_path(path)
        manifest[source_url] = {
            "src": public_path(output_path),
            "hash": hashlib.sha1(path.read_bytes()).hexdigest()[:12],
            "width": width,
            "height": height,
            "tone": tone,
            "card": {
                "src": public_path(card_path),
                "width": card.width,
                "height": card.height,
            },
        }
        trim = f"top={top} bottom={bottom} left={left} right={right}" if any((top, bottom, left, right)) else "none"
        if frame_info is None:
            card_trim = "no corner frame"
        elif frame_info == "poster":
            card_trim = "poster kept as card"
        else:
            frame, bounds, inset = frame_info
            card_trim = f"frame={frame} bounds={bounds} inset={inset}px"
        print(
            f"{source_url}: trim {trim}; {width}x{height}; tone={tone} "
            f"mean={luminance:.4f}; card={card_path.name} {card.width}x{card.height}; {card_trim}"
        )

    lines = ["export const media = {"]
    for source_url, entry in manifest.items():
        lines.append(f"  {json.dumps(source_url)}: {{")
        for key, value in entry.items():
            lines.append(f"    {key}: {json.dumps(value)},")
        lines.append("  },")
    lines.append("};")
    MANIFEST.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
