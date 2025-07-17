export const defaultRoleTemplates = [
  {
    id: "credit",
    label: "CRediT (Contributor Roles Taxonomy)",
    link: "https://credit.niso.org/",
    roles: [
      {
        name: "Conceptualization",
        description: "Ideas; formulation or evolution of overarching research goals and aims.",
      },
      {
        name: "Data Curation",
        description:
          "Management activities to annotate (produce metadata), scrub data and maintain research data.",
      },
      {
        name: "Formal Analysis",
        description:
          "Application of statistical, mathematical, computational, or other formal techniques to analyze study data.",
      },
      {
        name: "Funding Acquisition",
        description:
          "Acquisition of the financial support for the project leading to this publication.",
      },
      {
        name: "Investigation",
        description:
          "Conducting a research and investigation process, specifically performing the experiments, or data/evidence collection.",
      },
      {
        name: "Methodology",
        description: "Development or design of methodology; creation of models.",
      },
      {
        name: "Project Administration",
        description:
          "Management and coordination responsibility for the research activity planning and execution.",
      },
      {
        name: "Resources",
        description:
          "Provision of study materials, reagents, materials, patients, laboratory samples, animals, instrumentation, computing resources, or other analysis tools.",
      },
      {
        name: "Software",
        description:
          "Programming, software development; designing computer programs; implementation of the computer code and supporting algorithms; testing of existing code components.",
      },
      {
        name: "Supervision",
        description:
          "Oversight and leadership responsibility for the research activity planning and execution, including mentorship external to the core team.",
      },
      {
        name: "Validation",
        description:
          "Verification, whether as a part of the activity or separate, of the overall replication/reproducibility of results/experiments and other research outputs.",
      },
      {
        name: "Visualization",
        description:
          "Preparation, creation and/or presentation of the published work, specifically visualization/data presentation.",
      },
      {
        name: "Writing – Original Draft",
        description:
          "Preparation, creation and/or presentation of the published work, specifically writing the initial draft (including substantive translation).",
      },
      {
        name: "Writing – Review & Editing",
        description:
          "Preparation, creation and/or presentation of the published work by those from the original research group, specifically critical review, commentary or revision—including pre- or post-publication stages.",
      },
    ],
  },
  {
    id: "cro",
    label: "Contributor Role Ontology (CRO)",
    link: "https://data2health.github.io/contributor-role-ontology/",
    roles: [
      {
        name: "Acceptor role",
        description:
          "A role that is realized through the act of formally accepting an artifact for inclusion in some larger resource (e.g. database, registry, collection, etc.)",
      },
      {
        name: "Acquisition role",
        description:
          "Selecting, ordering, and receiving materials or physical objects for research, scholarly, library or archival collections.",
      },
      {
        name: "Advisory role",
        description: "A role that involves giving advice in a particular field.",
      },
      {
        name: "Archivist role",
        description:
          "A professional who assesses, collects, organizes, preserves, maintains control over, and provides access to information determined to have long-term value.",
      },
      {
        name: "Author role",
        description:
          "Creation and/or presentation of a published research object, such as books, journal articles, and other publications like technical documentation, web sites, code, ontologies, or data models.",
      },
      {
        name: "Background and literature search role",
        description:
          "Includes literature searches and contributions to review activities (systematic reviews, scoping reviews, etc.)",
      },
      {
        name: "Code review role",
        description:
          "Examination of software code to identify build-breaking changes prior to acceptance into a codebase.",
      },
      {
        name: "Collection role",
        description:
          "Activities to obtain physical objects for research or scholarly purposes or to add to a collection.",
      },
      {
        name: "Community engagement role",
        description:
          "A communication role which involves the dynamic relational process that facilitates communication, interaction, involvement, and exchange between an organization and a community for a range of social and organizational outcomes.",
      },
      {
        name: "Community research partner",
        description: "",
      },
      {
        name: "Compliance role",
        description:
          "Monitoring and enforcing adherence to laws, regulations, guidelines, and specifications relevant to research practices or organizational policy.",
      },
      {
        name: "Conceptualization role",
        description: "Formulation or evolution of overarching research goals and aims.",
      },
      {
        name: "Data analysis role",
        description:
          "Application of statistical, mathematical, computational, or other formal techniques to analyze data.",
      },
      {
        name: "Data architecture role",
        description: "Designing and managing the structure, storage, and retrieval of data.",
      },
      {
        name: "Data curation role",
        description:
          "Management activities to annotate (produce metadata), scrub data and maintain research data for initial use and later re-use.",
      },
      {
        name: "Data retrieval role",
        description:
          "Process of obtaining data from a database or source system for use in a study.",
      },
      {
        name: "Database administration role",
        description:
          "Maintaining and overseeing databases, ensuring availability, integrity, and security of data.",
      },
      {
        name: "Documentation role",
        description:
          "A communication role in which one records the research process, decisions, or outputs.",
      },
      {
        name: "Ethics advisory role",
        description:
          "Provides ethical guidance and oversight on the conduct of research and its impacts.",
      },
      {
        name: "Ethics review role",
        description:
          "Evaluation of research plans and protocols to ensure they meet ethical standards.",
      },
      {
        name: "Funding acquisition role",
        description:
          "Acquisition of the financial support for the project leading to this publication.",
      },
      {
        name: "Graphic design role",
        description:
          "A communication role that utilizes the art or skill of combining text and pictures in visual output.",
      },
      {
        name: "Information technology systems role",
        description:
          "A role that involves the development, management or maintenance of IT systems used in research.",
      },
      {
        name: "Infrastructure development role",
        description:
          "Development of tools, resources, or platforms that enable research activities.",
      },
      {
        name: "Intellectual property role",
        description:
          "A role related to creations of the mind, such as inventions; literary and artistic works; designs; and symbols, names and images used in commerce.",
      },
      {
        name: "Investigation role",
        description:
          "Conducting a research and investigation process, specifically performing the experiments, or data/evidence collection.",
      },
      {
        name: "Leadership role",
        description: "Directing and managing the research project or a major component of it.",
      },
      {
        name: "Logistics role",
        description:
          "Coordinating and managing operational aspects such as materials, data collection schedules, and site access.",
      },
      {
        name: "Marketing and communication role",
        description: "Coordination of research dissemination through promotional activities.",
      },
      {
        name: "Mentorship role",
        description:
          "Guiding less experienced researchers or team members in research processes and career development.",
      },
      {
        name: "Metadata role",
        description:
          "Creating and managing metadata that describes data content, context, and structure.",
      },
      {
        name: "Methodology role",
        description: "Development or design of methodology; creation of models.",
      },
      {
        name: "Outreach role",
        description:
          "Engaging external stakeholders such as schools, industry, or the public in the research process.",
      },
      {
        name: "Participant recruitment role",
        description: "Identifying and enrolling individuals into research studies.",
      },
      {
        name: "Policy development role",
        description:
          "Policy development generally involves research, analysis, consultation and synthesis of information to produce advice and policy options.",
      },
      {
        name: "Preservation role",
        description:
          "Set of activities aimed at prolonging the life of a record, data, or artifact.",
      },
      {
        name: "Project administration role",
        description:
          "Management and coordination responsibility for the research activity planning and execution.",
      },
      {
        name: "Quality assurance role",
        description:
          "Systematic process of checking to see whether a product or service being developed is meeting specified requirements.",
      },
      {
        name: "Regulatory and compliance role",
        description: "Manage regulatory and compliance issues for the project.",
      },
      {
        name: "Repository management role",
        description: "Overseeing and maintaining digital repositories or data archives.",
      },
      {
        name: "Resources role",
        description:
          "Provision of study materials, instrumentation, computing resources, or other analysis tools.",
      },
      {
        name: "Software development role",
        description:
          "Programming, software development; designing computer programs; implementation of the computer code and supporting algorithms.",
      },
      {
        name: "Software testing role",
        description:
          "Verification that software meets requirements; includes unit testing, integration testing, system testing, and acceptance testing.",
      },
      {
        name: "Statistical modeling role",
        description: "Design and implementation of statistical models to interpret study data.",
      },
      {
        name: "Supervision role",
        description:
          "Oversight and leadership responsibility for the research activity planning and execution, including mentorship external to the core team.",
      },
      {
        name: "Technical support role",
        description: "Providing technical assistance and maintenance during research activities.",
      },
      {
        name: "Training role",
        description:
          "Providing instruction or structured learning opportunities to build skills or knowledge relevant to the project.",
      },
      {
        name: "Translator role",
        description: "Translating words or text from one language to another.",
      },
      {
        name: "Validation role",
        description:
          "Verification, whether as a part of the activity or separate, of the overall replication/reproducibility of results/experiments and other research outputs.",
      },
      {
        name: "Visualization role",
        description:
          "Preparation, creation and/or presentation of the published work, specifically visualization/data presentation.",
      },
      {
        name: "Writing – original draft role",
        description:
          "Preparation, creation and/or presentation of the published work, specifically writing the initial draft (including substantive translation).",
      },
      {
        name: "Writing – review & editing role",
        description:
          "Preparation, creation and/or presentation of the published work by those from the original research group, specifically critical review, commentary or revision—including pre- or post-publication stages.",
      },
    ],
  },
  {
    id: "credit_rct",
    label: "CRediT-RCT (Randomized Controlled Trials)",
    link: "https://doi.org/10.1186/s13063-023-07072-9",
    roles: [
      {
        name: "Conceptualization",
        description: "Ideas; formulation or evolution of overarching research goals and aims",
      },
      {
        name: "Funding acquisition",
        description:
          "Acquisition of the financial support for the project leading to this publication",
      },
      {
        name: "Project administration",
        description:
          "Management and coordination responsibility for conducting the trial, including the training of participating centers",
      },
      {
        name: "Site principal investigator",
        description:
          "For multi-center trials, the principal investigator coordinating all study affairs in a participating center",
      },
      {
        name: "Statistical analysis plan",
        description:
          "Detailed elaboration of the principal features of the analysis described in a clinical trial protocol, which includes procedures for statistical analysis of the primary and secondary variables and other data",
      },
      {
        name: "Investigation",
        description:
          "Conducting a research and investigation process, specifically sequence generation, allocation concealment, medical procedures of the intervention and control arms, data entry, outcome assessment, and follow up",
      },
      {
        name: "Data curation",
        description:
          "Management activities to annotate (produce metadata), scrub data and maintain research data (including software code, where it is necessary for interpreting the data itself) for initial use and later re-use",
      },
      {
        name: "Formal analysis",
        description:
          "Application of statistical, mathematical, computational, or other formal techniques to analyze or synthesize study data",
      },
      {
        name: "Writing-original & draft",
        description:
          "Preparation, creation and/or presentation of the published work, specifically writing the initial draft (including substantive translation)",
      },
      {
        name: "Writing-review & editing",
        description:
          "Preparation, creation, and/or presentation of the published work by those from the original research group, specifically critical review, commentary or revision, including pre- or post-publication stages",
      },
    ],
  },
  {
    id: "datacite",
    label: "DataCite Metadata Schema contributorTypes",
    link: "https://doi.org/10.14454/fsvm-n356",
    roles: [
      {
        name: "ContactPerson",
        description:
          "Person with knowledge of how to access, troubleshoot, or otherwise field issues related to the resource. May also be the 'Point of Contact' in an organisation that controls access to the resource, if that organisation is different from the Publisher, Distributor, and Data Manager.",
      },
      {
        name: "DataCollector",
        description:
          "Person or institution responsible for finding, gathering, or collecting data under the guidelines of the author(s) or Principal Investigator (PI). May also be used when crediting survey conductors, interviewers, event or condition observers, or persons responsible for monitoring key instrument data.",
      },
      {
        name: "DataCurator",
        description:
          "Person tasked with reviewing, enhancing, cleaning, or standardizing metadata and the associated data submitted for storage, use, and maintenance within a data centre or repository. Includes quality assurance focused on content and metadata.",
      },
      {
        name: "DataManager",
        description:
          "Person (or organisation with a staff of data managers, such as a data centre) responsible for maintaining the finished resource. Ensures digital preservation, availability, and compliance with standards.",
      },
      {
        name: "Distributor",
        description:
          "Institution tasked with responsibility to generate/disseminate copies of the resource in either electronic or print form. Works stored in more than one archive/repository may credit each as a distributor.",
      },
      {
        name: "Editor",
        description:
          "A person who oversees the details related to the publication format of the resource. May be credited in place of multiple creators with '(Ed.)' appended to the name.",
      },
      {
        name: "Funder",
        description:
          "Institution or agency that provided financial support for the creation of the resource.",
      },
      {
        name: "HostingInstitution",
        description:
          "Organisation allowing the resource to be available on the internet or stored offline through operational support. Often a university, research center, or data centre.",
      },
      {
        name: "Producer",
        description:
          "Typically, a person or organisation responsible for the artistry and form of a media product. In the data industry, this may be a company producing physical media for future dissemination.",
      },
      {
        name: "ProjectLeader",
        description:
          "Person officially designated as head of the project team or sub-team. May be the Principal Investigator (PI) or project director or manager. May have overall responsibility for the research, including research design and reporting.",
      },
      {
        name: "ProjectManager",
        description:
          "Person who is taking responsibility for the execution and management of the research project (as opposed to the administration of the funding).",
      },
      {
        name: "ProjectMember",
        description:
          "Person included on a research project team, but not listed under another role.",
      },
      {
        name: "RegistrationAgency",
        description:
          "Institution or organisation that registers the resource with a registration authority.",
      },
      {
        name: "RegistrationAuthority",
        description:
          "A standards organisation from which registration metadata is obtained. Examples include DataCite, Crossref, or other DOI registration authorities.",
      },
      {
        name: "RelatedPerson",
        description:
          "A person who is referenced in the description of a resource, but not directly involved in its creation. May be the subject of the resource.",
      },
      {
        name: "Researcher",
        description:
          "A person involved in analysing and interpreting data or results, contributing to the theoretical framework, or writing up the results.",
      },
      {
        name: "ResearchGroup",
        description:
          "A group of individuals, including but not limited to Principal Investigators and project managers, involved in a research activity.",
      },
      {
        name: "RightsHolder",
        description:
          "Person or institution owning or managing property rights, including intellectual property rights over the resource.",
      },
      {
        name: "Sponsor",
        description:
          "Person or organisation that issued a financial award for the resource or otherwise supported the research leading to the resource.",
      },
      {
        name: "Supervisor",
        description:
          "Designated individual who has primary responsibility for the development of early-stage researchers. Typically serves as mentor/advisor.",
      },
      {
        name: "WorkPackageLeader",
        description:
          "The Work Package Leader is responsible for ensuring the comprehensive contents, versioning, and availability of the Work Package during the development of the resource. A Work Package is a recognized data product, not all of which is included in publication. The package, instead, may include notes, discarded documents, etc., and correlate it to the data collected for the experiment or study, for example. May operate at a narrower level of scope; may or may not hold less administrative responsibility than a project team.",
      },
      {
        name: "Other",
        description:
          "Any person or institution making a significant contribution to the development and/or maintenance of the resource, but whose contribution is not adequately described by any of the other values for contributorType. Could be a photographer, artist, or writer whose contribution helped to publicize the resource (as opposed to creating it), a reviewer of the resource, someone providing administrative services to the author (such as depositing updates into an online repository, analysing usage, etc.), or one of many other roles.",
      },
    ],
  },
  {
    id: "datacredit",
    label: "DataCReDiT (Dataset Contributor Roles)",
    link: "https://www.go-fair.org/fair-principles/datacredit/",
    roles: [
      {
        name: "Collection",
        description:
          "Involvement in gathering and measuring information on targeted variables for a research dataset.",
      },
      {
        name: "Validation",
        description:
          "Verification and cleaning of the dataset, whether as a part of the collection activity or separate.",
      },
      {
        name: "Curation",
        description:
          "Involvement in annotating (producing metadata) and maintaining research data for use and re-use.",
      },
      {
        name: "Software",
        description:
          "Implementation of the computer code and algorithms that assisted in the collection, validation, curation or publication of the dataset.",
      },
      {
        name: "Publication",
        description:
          "Responsibility and involvement in activities related to the publication of the research dataset in a science data repository.",
      },
      {
        name: "Supervision",
        description:
          "Oversight and leadership responsibility for achieving goals related to the collection, validation, curation or publication of the dataset.",
      },
    ],
  },
]
