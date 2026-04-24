import { NprmDocument } from "../lib/types";

export const sampleNprms: NprmDocument[] = [
  {
    id: "epa-pfas-2024",
    docketId: "EPA-HQ-OW-2024-0123",
    agency: "Environmental Protection Agency",
    title: "National Primary Drinking Water Regulations for PFAS Chemicals",
    summary:
      "The EPA is proposing National Primary Drinking Water Regulations (NPDWR) for six per- and polyfluoroalkyl substances (PFAS), including PFOA and PFOS. This rule would establish legally enforceable Maximum Contaminant Levels (MCLs) and require public water systems to monitor for these chemicals, notify the public of PFAS levels, and reduce PFAS in drinking water if they exceed the standards. EPA estimates this rule would prevent thousands of deaths and reduce tens of thousands of serious illnesses.",
    publishedDate: "2024-03-14",
    commentDeadline: "2024-05-13",
    url: "https://www.regulations.gov/docket/EPA-HQ-OW-2024-0123",
    keyTopics: ["drinking water safety", "PFAS contamination", "water utilities", "public health", "environmental justice"],
    sections: [
      {
        id: "s1",
        title: "I. Background — Health Effects of PFAS",
        content:
          "Epidemiological studies have linked PFAS exposure to various adverse health outcomes including developmental effects in children, increased risk of certain cancers, immune system dysfunction, thyroid disorders, and decreased fertility. The Agency has determined that PFOA and PFOS are likely carcinogenic to humans. Communities near military bases, airports, and industrial facilities using firefighting foam face disproportionate exposure. Additionally, PFAS compounds accumulate in the human body over time and do not break down in the environment, earning them the label 'forever chemicals.'",
        pageRef: "Pages 3-12",
        keyProposal:
          "EPA is proposing Maximum Contaminant Level Goals (MCLGs) of zero for PFOA and PFOS based on carcinogenic effects.",
        agencyReasoning:
          "The Safe Drinking Water Act requires EPA to set MCLGs at levels where no known or anticipated adverse health effects occur, with an adequate margin of safety.",
        questionsAsked: [
          "Are there additional peer-reviewed studies on PFAS health effects that EPA should consider, particularly regarding vulnerable populations such as children, pregnant women, and communities with pre-existing health disparities?",
          "What unintended consequences might arise from setting MCLGs at zero for PFOA and PFOS?",
        ],
      },
      {
        id: "s2",
        title: "II. Proposed MCLs and Monitoring Requirements",
        content:
          "EPA is proposing individual MCLs of 4.0 parts per trillion for PFOA and 4.0 parts per trillion for PFOS. For the other four PFAS compounds (PFNA, PFHxS, PFBS, and GenX), EPA proposes using a Hazard Index approach where the combined ratio of detected concentrations to their respective health-based water concentrations must not exceed 1.0. All community water systems serving more than 10,000 people would be required to conduct initial monitoring within three years of the rule's effective date, with ongoing compliance monitoring thereafter.",
        pageRef: "Pages 13-28",
        keyProposal:
          "Enforceable MCLs of 4.0 ppt each for PFOA and PFOS; Hazard Index of 1.0 for four additional PFAS compounds.",
        agencyReasoning:
          "The proposed levels are based on what the Agency has determined is feasible with current treatment technologies while protecting public health to the greatest extent possible.",
        questionsAsked: [
          "EPA requests comment on whether the proposed timeline for initial monitoring (3 years) is sufficient for water systems to develop and implement monitoring plans, particularly for smaller systems with limited resources.",
          "Are there alternative analytical methods for PFAS detection that EPA should consider, especially methods that might reduce monitoring costs for smaller water systems?",
        ],
      },
      {
        id: "s3",
        title: "III. Economic Impact on Small Water Systems",
        content:
          "EPA estimates the total annual cost of this rule at $1.2 billion, with approximately 66% of costs borne by water systems serving fewer than 10,000 people. Small and rural water systems face disproportionate financial burdens as they lack economies of scale for treatment infrastructure. The Agency projects that household water bills could increase by $85-$350 annually depending on system size. EPA has identified $9 billion in available funding through the Bipartisan Infrastructure Law for PFAS treatment, but acknowledges this may be insufficient to cover all systems.",
        pageRef: "Pages 29-45",
        keyProposal:
          "Financial impact assessment showing disproportionate burden on small/rural water systems; $9B in available BIL funding identified.",
        agencyReasoning:
          "The SDWA requires EPA to consider costs and benefits when setting standards. The Agency believes the quantified health benefits ($1.5B-$2.3B annually) justify the costs.",
        questionsAsked: [
          "How can funding mechanisms be structured to ensure equitable access to treatment infrastructure, particularly for rural, tribal, and underserved communities that may lack technical and financial capacity?",
          "Are there innovative treatment technologies, shared treatment approaches, or regional partnerships that could reduce per-household costs for small systems?",
        ],
      },
      {
        id: "s4",
        title: "IV. Environmental Justice Considerations",
        content:
          "EPA's environmental justice analysis indicates that communities of color and low-income communities are disproportionately exposed to PFAS contamination due to proximity to industrial sources, military installations, and airports. These same communities often rely on smaller water systems with fewer resources for treatment and have higher rates of underlying health conditions that increase susceptibility to PFAS health effects. EPA is seeking comment on additional measures to address environmental justice concerns in the implementation of this rule.",
        pageRef: "Pages 46-55",
        keyProposal:
          "Environmental justice analysis showing disparate impacts; EPA seeks additional measures to address equity in implementation.",
        agencyReasoning:
          "Executive Order 14096 on Revitalizing Our Nation's Commitment to Environmental Justice directs agencies to address disproportionate environmental and health impacts on underserved communities.",
        questionsAsked: [
          "What specific implementation measures would most effectively address environmental justice concerns related to PFAS contamination in drinking water?",
          "How should EPA prioritize enforcement, technical assistance, and funding to ensure that disproportionately impacted communities receive timely protection under this rule?",
        ],
      },
    ],
  },
  {
    id: "fcc-broadband-2024",
    docketId: "FCC-2024-0001",
    agency: "Federal Communications Commission",
    title: "Restoring Internet Freedom — Broadband Consumer Labels and Data Caps",
    summary:
      "The FCC is proposing rules that would require broadband internet service providers to display standardized consumer labels (similar to nutrition labels) disclosing prices, speeds, data caps, and other key terms. The proposal also seeks comment on whether the Commission should restrict or prohibit the use of data caps by broadband providers, given their impact on low-income households and rural communities where broadband competition is limited.",
    publishedDate: "2024-02-01",
    commentDeadline: "2024-04-15",
    url: "https://www.regulations.gov/docket/FCC-2024-0001",
    keyTopics: ["broadband access", "consumer transparency", "data caps", "digital divide", "rural internet"],
    sections: [
      {
        id: "s1",
        title: "I. Broadband Consumer Labels — Design and Content",
        content:
          "The Commission proposes a standardized broadband consumer label modeled after the FDA's nutrition facts label. The label would require providers to disclose: (1) monthly price including all fees; (2) introductory rates and their duration; (3) typical download and upload speeds; (4) latency; (5) data caps with clear overage charges; (6) early termination fees; and (7) links to network management and privacy policies. Labels must be displayed at the point of sale — both online and in physical retail locations — and must be machine-readable to enable comparison tools.",
        pageRef: "Pages 4-18",
        keyProposal: "Mandatory standardized broadband labels at point of sale, modeled after nutrition facts labels.",
        agencyReasoning: "The Infrastructure Investment and Jobs Act directs the FCC to require broadband labels to help consumers make informed choices.",
        questionsAsked: [
          "What information, beyond the items listed, should be included on broadband consumer labels to enable consumers to make informed decisions?",
          "How should labels account for service bundles that include broadband with television or phone services?",
        ],
      },
      {
        id: "s2",
        title: "II. Data Caps — Impact on Consumers and Competition",
        content:
          "The Commission seeks comment on the prevalence, justification, and consumer impact of data caps in broadband service plans. Preliminary data shows that approximately 65% of fixed broadband plans include data caps, typically ranging from 250GB to 1.5TB per month. Low-income households, rural residents relying on fixed wireless or satellite internet, and families with multiple remote workers or students are disproportionately affected. The Commission notes that data caps may function as barriers to online education, telehealth, and remote work.",
        pageRef: "Pages 19-32",
        keyProposal: "Exploring regulatory action on data caps including mandatory disclosure standards and potential prohibition.",
        agencyReasoning: "Congress has expressed concern that data caps undermine the goals of universal broadband access and may not be technically justified.",
        questionsAsked: [
          "What is the actual consumer impact of data caps, particularly for low-income households, students, and rural residents? The Commission seeks specific examples and data.",
          "Are data caps technically necessary for network management, or do they primarily serve as revenue mechanisms? Provide evidence supporting your position.",
        ],
      },
      {
        id: "s3",
        title: "III. Enforcement and Consumer Complaint Mechanisms",
        content:
          "The Commission proposes a centralized online portal for consumers to report broadband label non-compliance, deceptive pricing, and data cap-related issues. The proposal includes authority for the FCC to levy fines up to $100,000 per violation for providers that fail to display accurate labels or that misrepresent service terms. The Commission seeks comment on the appropriate enforcement framework and whether state attorneys general should have concurrent enforcement authority.",
        pageRef: "Pages 33-42",
        keyProposal: "Online complaint portal and enforcement authority with fines up to $100,000 per violation.",
        agencyReasoning: "Effective enforcement mechanisms are necessary to ensure compliance and protect consumers from deceptive practices.",
        questionsAsked: [
          "Is the proposed maximum fine of $100,000 per violation sufficient to deter non-compliance by large broadband providers?",
          "What role should state attorneys general play in enforcing broadband label requirements alongside the FCC?",
        ],
      },
    ],
  },
  {
    id: "hhs-telehealth-2024",
    docketId: "HHS-2024-0005",
    agency: "Department of Health and Human Services",
    title: "Telehealth Prescribing Flexibility — Post-PHE Permanent Rule",
    summary:
      "HHS is proposing to make permanent certain telehealth flexibilities that were temporarily authorized during the COVID-19 public health emergency. The rule addresses: (1) permanent authorization for telehealth prescribing of controlled substances without an in-person evaluation (the Ryan Haight Act waiver); (2) Medicare reimbursement parity for telehealth visits; (3) cross-state licensure recognition for telehealth providers; and (4) accessibility requirements for telehealth platforms serving individuals with disabilities.",
    publishedDate: "2024-01-15",
    commentDeadline: "2024-03-31",
    url: "https://www.regulations.gov/docket/HHS-2024-0005",
    keyTopics: ["telehealth", "prescription access", "rural healthcare", "disability access", "mental health"],
    sections: [
      {
        id: "s1",
        title: "I. Telehealth Prescribing of Controlled Substances",
        content:
          "During the COVID-19 PHE, DEA granted a temporary waiver of the Ryan Haight Act requirement for an in-person medical evaluation before prescribing controlled substances via telehealth. HHS proposes making this waiver permanent for: (a) Schedule III-V controlled substances prescribed for opioid use disorder treatment (buprenorphine); (b) psychiatric medications prescribed by qualified mental health providers; and (c) ongoing prescription renewals where an in-person evaluation occurred within the previous 24 months. For Schedule II substances, a one-time in-person evaluation would still be required before telehealth prescribing.",
        pageRef: "Pages 3-22",
        keyProposal: "Permanent telehealth prescribing for buprenorphine, psychiatric medications, and renewal prescriptions.",
        agencyReasoning: "Data from the PHE demonstrated that telehealth prescribing increased access to substance use disorder treatment without a corresponding increase in diversion or adverse events.",
        questionsAsked: [
          "Should additional categories of controlled substances be eligible for permanent telehealth prescribing? Provide clinical evidence supporting your position.",
          "What safeguards should accompany permanent telehealth prescribing authority to prevent diversion while maintaining access?",
        ],
      },
      {
        id: "s2",
        title: "II. Medicare Telehealth Reimbursement Parity",
        content:
          "HHS proposes to establish permanent Medicare reimbursement parity between in-person and telehealth visits for: primary care, mental health services, substance use disorder treatment, and chronic disease management. The proposal would set telehealth reimbursement rates at 100% of the in-person rate for audio-video visits and 85% for audio-only visits. HHS estimates this would increase telehealth utilization by 40-60% among Medicare beneficiaries, particularly those in rural areas and those with mobility limitations.",
        pageRef: "Pages 23-38",
        keyProposal: "Permanent Medicare reimbursement parity for telehealth visits across multiple service categories.",
        agencyReasoning: "Analysis of PHE data shows telehealth reduced missed appointments by 35% and increased access for rural Medicare beneficiaries by 50%.",
        questionsAsked: [
          "Should audio-only telehealth visits receive the same reimbursement rate as audio-video visits given that many rural and elderly patients lack broadband access or technical proficiency?",
          "What quality metrics should CMS use to ensure that permanent telehealth reimbursement does not lead to overutilization or reduced quality of care?",
        ],
      },
      {
        id: "s3",
        title: "III. Cross-State Licensure and Access Barriers",
        content:
          "The proposal includes a framework for cross-state telehealth licensure recognition, enabling healthcare providers licensed in one state to provide telehealth services to patients in any state. Providers would register with a national telehealth provider database and comply with the practice standards of the patient's state. HHS estimates this would increase healthcare access for 30 million Americans who live in Health Professional Shortage Areas (HPSAs), the majority of which are in rural and frontier regions.",
        pageRef: "Pages 39-52",
        keyProposal: "National framework for cross-state telehealth licensure recognition.",
        agencyReasoning: "State-level licensure barriers are the primary obstacle to telehealth expansion; 78% of providers surveyed reported declining telehealth appointments due to cross-state licensure restrictions.",
        questionsAsked: [
          "What mechanisms would ensure state medical boards maintain appropriate oversight of out-of-state providers while not creating undue administrative burden?",
          "How should the framework address differences in scope of practice laws across states, particularly for advanced practice providers?",
        ],
      },
    ],
  },
];
