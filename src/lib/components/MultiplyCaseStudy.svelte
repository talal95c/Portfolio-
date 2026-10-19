<script>
  import CaseStudyChart from './CaseStudyChart.svelte';
  import CaseStudyFigure from './CaseStudyFigure.svelte';
</script>

<article aria-label="Multiply case study" class="svelte-ewfald">
  <div class="intro copy svelte-ewfald">
    <p class="lead svelte-ewfald">Helping loan officers know what to do next.</p>
    <p class="svelte-ewfald">Over the summer, I redesigned Multiply’s internal command center and CRM, working on the tools our loan officers used to manage loans and stay in touch with borrowers. I wanted someone logging in to know what needed their attention and how to get it done.</p>
    <h3 class="svelte-ewfald">A main project, and a little bit of everything</h3>
    <p class="svelte-ewfald">I owned the product design for the CRM and command center. Our PM helped set direction, engineering built the designs, and the other designer gave feedback while focusing primarily on our rebrand and marketing work. I worked within an existing design system, but had room to establish new interactions and navigation patterns.</p>
    <p class="svelte-ewfald">I really enjoyed having one project I could go deep on while also working on whatever came up along the way. If a loan officer got stuck, something needed fixing, or product wanted to add a feature, I got to jump in.</p>
  </div>

  <section id="command-center" aria-labelledby="command-center-title" class="svelte-ewfald">
    <div class="copy svelte-ewfald">
      <h2 id="command-center-title" class="svelte-ewfald"><span class="section-number svelte-ewfald" aria-hidden="true">01<span class="rule svelte-ewfald"></span></span>A command center<br />that grew up</h2>
      <p class="svelte-ewfald">The command center had grown organically. New tools kept getting added, but the navigation was still built around one or two use cases. Each tool had its own layout, and the experience felt fragmented.</p>
      <p class="svelte-ewfald">There wasn’t really a dashboard yet, only a starting point with links to different tools. As the product grew, helping loan officers find a feature was only part of the problem. We also needed to help them figure out what to do when they got there.</p>
    </div>
    <div class="visual narrow-visual svelte-ewfald">
      <CaseStudyFigure
        src="/work/multiply/case-study/dashboard-before.webp"
        width={2400}
        height={2392}
        alt="Original command center with a welcome message and a short list of tools, including rate quotes and loan applications."
        label="Before · a list of tools"
        caption="The original starting point asked loan officers what they wanted to do, but offered little context about what needed attention."
      />
    </div>
    <div class="copy svelte-ewfald">
      <h3 class="svelte-ewfald">Understanding how people actually worked</h3>
      <p class="svelte-ewfald">I watched dozens of session replays, looked at usage metrics, and talked individually with loan officers. I first met with them to understand the problems they were running into, then came back with variations and potential directions.</p>
      <p class="svelte-ewfald">This was especially useful because what a loan officer wanted to do wasn’t always the same as what product wanted to encourage. I had to understand both: make the tool useful in their day-to-day work, while helping drive outcomes like more consistent borrower outreach.</p>
      <h3 class="svelte-ewfald">Finding a structure the product could grow into</h3>
      <p class="svelte-ewfald">I explored top navigation, sidebars, and combinations of the two. A lot of the work was figuring out a layout and framework that could bring the tools together and still give us room to move things around as the product changed.</p>
      <p class="svelte-ewfald">I landed on a mix of top navigation and a sidebar. The sidebar gave the different tools a consistent home, so moving between prospects, applications, and loans felt like working within one product.</p>
    </div>
    <div class="visual svelte-ewfald">
      <CaseStudyFigure
        src="/work/multiply/case-study/navigation-explorations.webp"
        width={2400}
        height={1773}
        alt="Nine navigation explorations comparing top navigation, sidebars, and combinations around a loan management screen."
        label="Exploration · bringing the tools together"
        caption="Different approaches to navigation, explored around the same loan management workflow."
      />
    </div>
    <div class="copy svelte-ewfald">
      <h3 class="svelte-ewfald">From a starting page to a plan for the day</h3>
      <p class="svelte-ewfald">The dashboard became a place to see actionable tasks, borrowers who needed attention, and the status of active loans. Each section connected to the relevant tool or next action.</p>
      <p class="svelte-ewfald">Working with product and the loan officers helped determine what belonged here. One example was surfacing a borrower who hadn’t been contacted in the past week. That gave the officer a reason to reach out and helped keep people from falling through the cracks.</p>
    </div>
    <div class="visual dashboard-pair svelte-ewfald">
      <CaseStudyFigure
        src="/work/multiply/case-study/dashboard-after.webp"
        width={2400}
        height={3292}
        alt="Redesigned desktop dashboard with sidebar navigation, actionable tasks, people needing outreach, loan counts, and recent activity."
        label="After · a clearer next step"
        caption="Tasks, outreach, and loan status give the day a starting point."
      />
      <CaseStudyFigure
        src="/work/multiply/case-study/mobile-dashboard.webp"
        width={720}
        height={1560}
        alt="Mobile dashboard showing tools and actionable tasks above bottom navigation."
        label="On mobile"
        caption="The mobile layout brings tools and tasks into a narrower view."
      />
    </div>
    <div class="copy svelte-ewfald">
      <h3 class="svelte-ewfald">Shipping, listening, and going back in</h3>
      <p class="svelte-ewfald">I presented the redesign at Integral, our weekly company-wide all hands, and kept iterating after feedback. One small change was adding names on hover to the collapsed sidebar. With the sidebar open, the labels were obvious; when it collapsed, the icons had to do all the work. The hover labels made it possible to check what each icon meant.</p>
      <p class="svelte-ewfald">The entire dashboard and navigation redesign shipped, and I had time to keep refining it. Getting to see the work used—and then improve it—was one of the most valuable parts of the summer.</p>
    </div>
    <div class="visual pair svelte-ewfald">
      <CaseStudyFigure
        src="/work/multiply/case-study/prospects.webp"
        width={2398}
        height={1769}
        alt="Prospect list in the command center with the shared sidebar visible."
        label="One navigation across tools"
        caption="The shared sidebar carries through to the prospect list."
      />
      <CaseStudyFigure
        src="/work/multiply/case-study/collapsed-sidebar.webp"
        width={2398}
        height={1769}
        alt="Notifications settings page with the sidebar collapsed to a narrow column of icons."
        label="Sidebar collapsed"
        caption="Collapsed, the icons carry the navigation, and hovering one shows its name."
      />
    </div>
    <div class="copy svelte-ewfald">
      <h3 class="svelte-ewfald">A second view for loans in progress</h3>
      <p class="svelte-ewfald">One smaller project came out of processing. Loans there lived on a kanban board, which showed where each loan was but not what it was waiting on. Loan officers and processors had to open a loan to find out whether the appraisal was back or the rate lock had expired.</p>
      <p class="svelte-ewfald">I added a list view alongside the board. It keeps the same stages, but gives each loan a row of statuses: rate lock, title, appraisal, insurance, HOA, and the initial closing disclosure. Each one is colored like a traffic light, and funding dates are flagged when they slip. Both views shipped, with a toggle to switch between them.</p>
    </div>
    <div class="visual pair svelte-ewfald">
      <CaseStudyFigure
        src="/work/multiply/case-study/loan-pipeline.webp"
        width={2398}
        height={1769}
        alt="Processing kanban board with loan cards grouped by stage, each showing type, source, funding date, and time in stage."
        label="Cards · where each loan is"
        caption="The board shows each loan’s stage and how long it has been there."
      />
      <CaseStudyFigure
        src="/work/multiply/case-study/processing-list.webp"
        width={2400}
        height={1720}
        alt="Processing list view with loans grouped by stage and color-coded statuses for rate, title, appraisal, insurance, HOA, and closing disclosure, with a late funding date flagged in red."
        label="List · what each loan still needs"
        caption="The list puts every outstanding item on one row, with problems in red."
      />
    </div>
  </section>

  <section id="crm" aria-labelledby="crm-title" class="svelte-ewfald">
    <div class="copy svelte-ewfald">
      <h2 id="crm-title" class="svelte-ewfald"><span class="section-number svelte-ewfald" aria-hidden="true">02<span class="rule svelte-ewfald"></span></span>A shared picture<br />of each borrower</h2>
      <p class="svelte-ewfald">Multiply already had a basic CRM, but it was fragmented and difficult to use. Notes and marketing emails were there, while conversations between loan officers and borrowers lived in individual inboxes. Usage data also showed gaps: activity wasn’t being logged, and many borrower records had little activity.</p>
      <p class="svelte-ewfald">This mattered because one borrower could be supported by a team of loan officers, and branch managers sometimes needed to check in too. An individual inbox couldn’t give everyone the same picture of what was happening.</p>
      <h3 class="svelte-ewfald">Bringing the conversation into the CRM</h3>
      <p class="svelte-ewfald">I redesigned the activity log and cleaned up the surrounding experience, bringing loan officer and borrower emails alongside notes and marketing emails. The goal was to give the team one place to understand the relationship and pick up where someone else left off.</p>
    </div>
    <div class="visual pair svelte-ewfald">
      <CaseStudyFigure
        src="/work/multiply/case-study/crm-before.webp"
        width={2400}
        height={1720}
        alt="Original CRM activity modal with notes, contact outcomes, and save buttons."
        label="Before · the existing activity log"
        caption="The original CRM provided a basic place to record contact and notes."
      />
      <CaseStudyFigure
        src="/work/multiply/case-study/crm-after.webp"
        width={2400}
        height={2358}
        alt="Redesigned borrower record with an activity timeline, a note composer, and user information alongside it."
        label="After · more context in one place"
        caption="A fuller activity history sits alongside borrower information and a place to add a new entry."
      />
    </div>
    <div class="visual dashboard-pair svelte-ewfald">
      <CaseStudyFigure
        src="/work/multiply/case-study/activity-log.webp"
        width={2400}
        height={2844}
        alt="Loan activity log showing notes, borrower emails, marketing emails, and other events in a timeline."
        label="Within a loan"
        caption="The activity log brings different types of communication into one history."
      />
      <CaseStudyFigure
        src="/work/multiply/case-study/mobile-activity-log.webp"
        width={716}
        height={1622}
        alt="Mobile activity log with borrower emails and notes arranged chronologically."
        label="On mobile"
        caption="The same history, adapted to a smaller screen."
      />
    </div>
    <div class="copy svelte-ewfald">
      <div class="outcome svelte-ewfald">
        <p class="metric svelte-ewfald">4×</p>
        <h3 class="svelte-ewfald">More contacts with leads</h3>
        <p class="svelte-ewfald">One of the results I’m most proud of was seeing four times as many contacts with leads following the dashboard, navigation, and CRM improvements. The changes made it easier for loan officers to see who needed attention and work through their outreach.</p>
        <div class="stats svelte-ewfald">
          <div class="contact-rate svelte-ewfald">
            <span class="svelte-ewfald">126 <span aria-hidden="true">→</span> 427</span>
            <p class="svelte-ewfald">Notes logged per week, on average, after the activity log and note-taking changes.</p>
          </div>
          <div class="contact-rate svelte-ewfald">
            <span class="svelte-ewfald">Under 50% <span aria-hidden="true">→</span> ~95%</span>
            <p class="svelte-ewfald">Contacted by a loan officer within 24 hours of signing up or asking a question.</p>
          </div>
        </div>
        <CaseStudyChart />
        <p class="chart-caption svelte-ewfald">Leads contacted within 24 hours, by week. The rate climbed as changes to the dashboard, activity log, and note-taking shipped through May, and it has stayed between 80% and 100% every week since June.</p>
      </div>
      <p class="svelte-ewfald">Just as meaningful was hearing directly from the people using it. Paul, one of our loan officers, described how the redesign helped the team manage its pipeline and stay on top of outreach.</p>
      <blockquote class="svelte-ewfald">
        <p class="svelte-ewfald">“This redesign made navigation extremely smooth, allowing our sales team to manage its pipeline and really dial-in our client outreach cadence and tracking.”</p>
        <footer class="svelte-ewfald">Paul Gresh <span class="svelte-ewfald">Loan officer, Multiply</span></footer>
      </blockquote>
    </div>
  </section>

  <section id="emails" aria-labelledby="emails-title" class="svelte-ewfald">
    <div class="copy svelte-ewfald">
      <h2 id="emails-title" class="svelte-ewfald"><span class="section-number svelte-ewfald" aria-hidden="true">03<span class="rule svelte-ewfald"></span></span>A detour into emails</h2>
      <p class="svelte-ewfald">While working on the product, I took a short break to redesign our emails. We were switching to a more modern email platform during the rebrand, which meant rebuilding emails, workflows, and customer journeys.</p>
      <p class="svelte-ewfald">I owned the email redesign and came up with several new designs. Then we had another problem: there were dozens of individual emails to implement in code.</p>
      <h3 class="svelte-ewfald">Making the next email easier to build</h3>
      <p class="svelte-ewfald">I worked with the marketing team to develop reusable email components and implemented them in code. Then I created a custom Claude skill with instructions for our design system, the components, and how to use them together.</p>
      <p class="svelte-ewfald">The marketing team could use a simple prompt or a screenshot of a design to create a new email. That gave them a way to keep building with the system after the initial redesign.</p>
    </div>
    <div class="visual pair svelte-ewfald">
      <CaseStudyFigure
        src="/work/multiply/case-study/email-before.webp"
        width={960}
        height={1641}
        alt="Earlier Multiply Mortgage email with a logo header, a text introduction to refinancing, a call-to-action button, and an adviser signature."
        label="Before · text under a logo"
        caption="Earlier emails were mostly plain text with a single button."
      />
      <CaseStudyFigure
        src="/work/multiply/case-study/email-after.webp"
        width={467}
        height={808}
        alt="Redesigned Multiply email welcoming an employee to their homeownership benefit, with a photo header, a list of benefits with icons, and a call-to-action button."
        label="After · built from shared components"
        caption="A welcome email for employer partners, assembled from the new components."
      />
    </div>
    <div class="copy svelte-ewfald">
      <blockquote class="svelte-ewfald">
        <p class="svelte-ewfald">“Sam built a custom Claude skill that cut the project timeline from several months down to just a few weeks.”</p>
        <footer class="svelte-ewfald">Madison <span class="svelte-ewfald">Marketing, Multiply</span></footer>
      </blockquote>
    </div>
  </section>

  <section id="reflections" aria-labelledby="reflections-title" class="svelte-ewfald">
    <div class="copy svelte-ewfald">
      <h2 id="reflections-title" class="svelte-ewfald"><span class="section-number svelte-ewfald" aria-hidden="true">04<span class="rule svelte-ewfald"></span></span>What I’m taking<br />with me</h2>
      <h3 class="svelte-ewfald">Designing with the people using it</h3>
      <p class="svelte-ewfald">Being able to talk directly with loan officers, watch how they worked, and come back with something new made the process feel immediate. I got to move quickly, but also go deep. Almost everything I worked on shipped, and hearing that people loved the new experience meant a lot to me.</p>
      <h3 class="svelte-ewfald">Learning to hand off, and stay involved</h3>
      <p class="svelte-ewfald">This was my first time working with a full engineering team instead of developing my own designs. I learned to communicate through more detailed Figma wireframes and prototypes, and to think through the states and interactions someone else would need to build.</p>
      <p class="svelte-ewfald">Having experience building products helped a lot: I could speak the engineers’ language and jump into the codebase during QA to help get the details right. Handoff became another part of the collaboration.</p>
      <h3 class="svelte-ewfald">New doesn’t always mean most important</h3>
      <p class="svelte-ewfald">One lesson that stuck with me was recency bias in design. When we’re working on a new feature, it’s easy to want to make it the most visible thing in the product. But stepping back and looking at the whole experience, that isn’t always the right decision. Designing the command center made me think more carefully about where a feature belongs in someone’s actual workflow.</p>
      <p class="closing svelte-ewfald">I came away really enjoying this kind of work: owning something substantial, staying close to the people using it, and getting to help with the smaller things that make the whole product better.</p>
    </div>
    <div class="visual narrow-visual svelte-ewfald">
      <CaseStudyFigure
        src="/work/multiply/case-study/team.webp"
        width={2000}
        height={1525}
        alt="Sam with the Multiply team, standing together in the San Francisco office."
        caption="With the Multiply team at our San Francisco office."
      />
    </div>
  </section>
</article>
