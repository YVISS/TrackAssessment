// career-details-map.js
// Generated from the uploaded "Career List Descriptions" text.
// Use this in the frontend so the career buttons/modal can show details directly.

(function () {
  function normalizeCareerKey(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const CAREER_DETAILS_BY_KEY = {
  "accountant": {
    "displayName": "Accountant",
    "items": [
      {
        "name": "Accountant",
        "code": "CLE-NCE-NLE",
        "description": "Studies financial records in order to give advice on money matters or prepare financial statements. Prepares income tax forms or advises clients on certain business or financial decisions. Examines clients' financial records to see if they properly kept and reported. Develops estate plans, accounting systems, or budgets, and may advise on systems for recording financial data. Some teach courses in a business or professional organizations."
      }
    ]
  },
  "accounting clerk": {
    "displayName": "Accounting Clerk",
    "items": [
      {
        "name": "Accounting Clerk",
        "code": "NCE-NC-N",
        "description": "Performs any combination of routine calculating, posting, and verifying duties to obtain primary financial data for use in maintaining accounting records."
      }
    ]
  },
  "advertising account executive": {
    "displayName": "Advertising Account Executive",
    "items": [
      {
        "name": "Advertising Account Executive",
        "code": "E-IE",
        "description": "Develops advertising programs for client firms and individuals. Studies the client's sales, public image, and advertising problems, and the creates a program that suits the client's needs. In some small agencies, may be responsible for developing the actual artwork and advertising copy."
      }
    ]
  },
  "advertising copywriter": {
    "displayName": "Advertising Copywriter",
    "items": [
      {
        "name": "Advertising Copywriter",
        "code": "E-CIE-IE",
        "description": "Writes advertising copy for use by publications or broadcast media to promote sale of goods and services"
      }
    ]
  },
  "advertising manager": {
    "displayName": "Advertising Manager",
    "items": [
      {
        "name": "Advertising Manager",
        "code": "E-ILE-IEM-IE",
        "description": "Directs sale of display and classified advertising services for a publication. Consults with department head and other officials to plan special campaigns and to promote sale of advertising services to various industry or trade groups."
      }
    ]
  },
  "advertising sales": {
    "displayName": "Advertising Sales",
    "items": [
      {
        "name": "Advertising Sales",
        "code": "",
        "description": "Sells classified and display advertising space for publication. Using rate charts, computes cost of advertisement, based on size, date, position, and number of insertions."
      }
    ]
  },
  "aeronautical engineer": {
    "displayName": "Aeronautical Engineer",
    "items": [
      {
        "name": "Aeronautical Engineer",
        "code": "NLM",
        "description": "Designs , develops, and tests aircraft, space vehicles, surface effect vehicles, and missiles, applying engineering principles and techniques. Test models and prototypes to study and evaluate operational characteristics and effects of stress imposed during flight conditions."
      }
    ]
  },
  "agricultural engineering": {
    "displayName": "Agricultural Engineering",
    "items": [
      {
        "name": "Agricultural Engineering",
        "code": "LM",
        "description": "Applies engineering technology and knowledge of biological sciences to agricultural problems concerned with power and machinery, electrifications, structures, soil and water conservations, and processing of agricultural products"
      }
    ]
  },
  "agricultural microbiologist": {
    "displayName": "Agricultural Microbiologist",
    "items": [
      {
        "name": "Agricultural Microbiologist",
        "code": "CL-L",
        "description": "Studies bacteria, and other microorganisms to better understand their relation to human, plant and animal health"
      }
    ]
  },
  "agronomist": {
    "displayName": "Agronomist",
    "items": [
      {
        "name": "Agronomist",
        "code": "L",
        "description": "Conducts experiments or investigations in field-crop problems and develops new methods of growing crops to secure more efficient production, higher yield, and improved quality. Often develops methods for control of noxious weeds, crop diseases, and insect pests"
      }
    ]
  },
  "air conditioning mechanic": {
    "displayName": "Air-Conditioning Mechanic",
    "items": [
      {
        "name": "Air-Conditioning Mechanic",
        "code": "M",
        "description": "Installs, services, and repairs environmental-control systems in residences, department stores, office buildings, and commercial establishments, utilizing knowledge of refrigeration theory, pipefitting, and structural layout"
      },
      {
        "name": "Air-Conditioning Mechanic",
        "code": "LM",
        "description": "Plans requirements for fabricating, installing, testing, and servicing climate-control and heat-transfer assemblies and systems to assist engineering personnel, utilizing knowledge of heat-transfer technology and engineering methods"
      }
    ]
  },
  "aircraft inspector": {
    "displayName": "Aircraft Inspector",
    "items": [
      {
        "name": "Aircraft Inspector",
        "code": "C-CM",
        "description": "Keeps records of usage and time intervals between inspection and maintenance of designated airplane parts. Compiles data from flight schedules to compute time that airplane parts are in use"
      }
    ]
  },
  "airline dispatcher": {
    "displayName": "Airline Dispatcher",
    "items": [
      {
        "name": "Airline Dispatcher",
        "code": "C",
        "description": "Authorizes, regulates, and controls commercial airline flights according to government and company regulations to expedite and ensure safety of flight."
      }
    ]
  },
  "airline lounge receptionist": {
    "displayName": "Airline-Lounge Receptionist",
    "items": [
      {
        "name": "Airline-Lounge Receptionist",
        "code": "CIE-C-CI",
        "description": "Admits members and guests to airline lounge, serves beverages and snacks, and provides other personal services as requested. Answers questions regarding scheduled flights and terminal facilities. Verifies passengers’ reservations."
      }
    ]
  },
  "airline pilot": {
    "displayName": "Airline Pilot",
    "items": [
      {
        "name": "Airline Pilot",
        "code": "LM",
        "description": "Pilots airplane to transport passengers, mail, or freight, or for other commercial purposes. Reviews aircraft’s papers to ascertain factors, such as load weight, fuel supply, weather conditions, and flight route and schedule. Contacts control tower by radio to obtain take-off clearance and instructions. Logs information such as time in flight, altitude flown, and fuel consumed."
      }
    ]
  },
  "airline flight attendant": {
    "displayName": "Airline Flight Attendant",
    "items": [
      {
        "name": "Airline Flight Attendant",
        "code": "CI",
        "description": "Performs a variety of personal services conducive to safety and comfort of airline passengers during flight. Greets passengers, verifies tickets, records destinations, and explains use of safety equipment aboard airplane."
      }
    ]
  },
  "anesthesiologist": {
    "displayName": "Anesthesiologist",
    "items": [
      {
        "name": "Anesthesiologist",
        "code": "NLM-NIM",
        "description": "Administers anesthetics during surgery or other medical procedures. Examines patient to determine degree of surgical risk and type of anesthesia to administer."
      }
    ]
  },
  "animal technician": {
    "displayName": "Animal Technician",
    "items": [
      {
        "name": "Animal Technician",
        "code": "IL",
        "description": "Works under the supervision of professional personnel such as veterinarians, physiologists, or microbiologists, performing routine laboratory and clinical procedures in a veterinary clinic. May take samples of various body fluids or tissues and make chemical analyses."
      }
    ]
  },
  "animator": {
    "displayName": "Animator",
    "items": [
      {
        "name": "Animator",
        "code": "CM-M",
        "description": "Draws animated cartoons for use in motion pictures or television. Renders series of sequential drawings which when projected at specific speed, become animated."
      }
    ]
  },
  "apartment condominium superintendent": {
    "displayName": "Apartment/Condominium Superintendent",
    "items": [
      {
        "name": "Apartment/Condominium Superintendent",
        "code": "EM",
        "description": "Directs activities of workers engaged in operating and maintaining facilities and equipment in apartment/condominium buildings."
      }
    ]
  },
  "appraiser": {
    "displayName": "Appraiser",
    "items": [
      {
        "name": "Appraiser",
        "code": "NE",
        "description": "Appraises merchandise, fixtures, machinery, and equipment of business firms to ascertain values for such purposes as approval of loans, issuance of insurance policies, dispositions of estates, and liquidation of assets of bankrupt firms."
      }
    ]
  },
  "arcade attendant": {
    "displayName": "Arcade Attendant",
    "items": [
      {
        "name": "Arcade Attendant",
        "code": "EM",
        "description": "Assists patrons of amusement facility, performs minor repairs on game machines, explains operation of game machines to clients/customers."
      }
    ]
  },
  "architect": {
    "displayName": "Architect",
    "items": [
      {
        "name": "Architect",
        "code": "LEM-NEM",
        "description": "Plans and designs structures such as private residences, office buildings, theaters, factories, and other structural property. Plans project layout, integrates engineering elements, and prepares information regarding design, structure specifications, material, equipment, costs and construction time. May oversee on-site project, direct workers, prepare contracts, and represent clients with other contractors."
      }
    ]
  },
  "architectural graphic designer": {
    "displayName": "Architectural Graphic Designer",
    "items": [
      {
        "name": "Architectural Graphic Designer",
        "code": "NEM-LM",
        "description": "Works with architects, using type and color to design the graphic symbols that identify buildings. Depending on the purpose of a building or complex, the architectural graphic designer may also design presentation brochures, stationery, or shopping bags. A knowledge of typography, color reproduction skill, and an understanding of contemporary architecture and building materials are required."
      }
    ]
  },
  "art director": {
    "displayName": "Art Director",
    "items": [
      {
        "name": "Art Director",
        "code": "LEM",
        "description": "Formulates design concepts and presentation approaches, and directs workers engaged in art work, layout design, and copy writing for visual communications media such as magazines, books, newspapers, and packaging."
      }
    ]
  },
  "artificial eye maker": {
    "displayName": "Artificial-Eye Maker",
    "items": [
      {
        "name": "Artificial-Eye Maker",
        "code": "M",
        "description": "Fabricates artificial glass or plastic eyes according to physician’s prescription or customer specifications."
      }
    ]
  },
  "art teacher": {
    "displayName": "Art Teacher",
    "items": [
      {
        "name": "Art Teacher",
        "code": "CIM-M-IM",
        "description": "Instructs pupils in art such as painting, sketching, designing, and sculpturing. Observes pupils’ work to make criticisms and corrections. May plan and supervise student contests and arrange art exhibits."
      }
    ]
  },
  "athletic trainer": {
    "displayName": "Athletic Trainer",
    "items": [
      {
        "name": "Athletic Trainer",
        "code": "IL",
        "description": "Evaluates physical condition and advises and treats professional and amateur athletes to maintain maximum physical fitness for participation in athletic competition."
      }
    ]
  },
  "audio technician": {
    "displayName": "Audio Technician",
    "items": [
      {
        "name": "Audio Technician",
        "code": "M",
        "description": "Controls audio equipment to regulate volume level and quality of sound during radio or television broadcasts, according to script and instructions of radio or television broadcasting technical director."
      }
    ]
  },
  "audiovisual technician": {
    "displayName": "Audiovisual Technician",
    "items": [
      {
        "name": "Audiovisual Technician",
        "code": "M",
        "description": "Operates audiovisual or sound-reproducing equipment to provide or complement educational or public service programs offered by institutions such as museums, zoos, or libraries. Coordinates equipment operation with material presented and maintains equipment in good working condition."
      }
    ]
  },
  "audit accounting aide": {
    "displayName": "Audit Accounting Aide",
    "items": [
      {
        "name": "Audit Accounting Aide",
        "code": "NCI",
        "description": "Assists in the examination of a taxpayer’s records by preparing exhibits, schedules, and computations of taxpayer’s records."
      }
    ]
  },
  "auditor": {
    "displayName": "Auditor",
    "items": [
      {
        "name": "Auditor",
        "code": "NCE-NC",
        "description": "Examines and analyzes accounting records of establishment and prepares reports concerning its financial status and operating procedures. Analyzes data to check for duplication of effort, extravagance, fraud, or lack of compliance with management’s established policies."
      }
    ]
  },
  "automobile mechanic": {
    "displayName": "Automobile Mechanic",
    "items": [
      {
        "name": "Automobile Mechanic",
        "code": "LM-M",
        "description": "Repairs and overhauls automobiles, buses, trucks, and other automotive vehicles. Other important assets are the ability to make quick and accurate diagnoses, as well as good reasoning ability and thorough knowledge of automobiles."
      }
    ]
  },
  "automobile salesperson": {
    "displayName": "Automobile Salesperson",
    "items": [
      {
        "name": "Automobile Salesperson",
        "code": "E",
        "description": "Sells new or used automobiles on premises of automobile agency. Explains features and demonstrates operation of car. Suggests optional equipment for customer to purchase. Computes and quotes sales price, including tax, trade-in allowance, license fee, discount, and requirements for financing payment of car on credit."
      }
    ]
  },
  "bacteriologist": {
    "displayName": "Bacteriologist",
    "items": [
      {
        "name": "Bacteriologist",
        "code": "CL-L",
        "description": "Studies growth, structure, development, and general characteristics of bacteria and other microorganisms."
      }
    ]
  },
  "bakery manager": {
    "displayName": "Bakery Manager",
    "items": [
      {
        "name": "Bakery Manager",
        "code": "E",
        "description": "Directs and coordinates activities involved with production, sale, and distribution of bakery products. Plans product distribution to customers and negotiates with suppliers to arrange purchase and delivery of bakery supplies."
      }
    ]
  },
  "bank cashier": {
    "displayName": "Bank Cashier",
    "items": [
      {
        "name": "Bank Cashier",
        "code": "E-CE-NCE",
        "description": "Directs and coordinates activities relative to creating and administering private, corporate, probate, and court-ordered guardianship trusts in accordance with terms creating trust, decedent’s will, probate court, or court order."
      }
    ]
  },
  "bank credit analyst": {
    "displayName": "Bank Credit Analyst",
    "items": [
      {
        "name": "Bank Credit Analyst",
        "code": "LE-NLE",
        "description": "Analyzes detailed financial reports submitted by the applicant, interviews a representative of the company about its management, and reviews credit-agency reports to determine the firm’s record in repaying debts."
      }
    ]
  },
  "bank lending officer": {
    "displayName": "Bank Lending Officer",
    "items": [
      {
        "name": "Bank Lending Officer",
        "code": "LE-NLE",
        "description": "Evaluates the credit and collateral of individuals and businesses applying for a loan. May handle installment, commercial, real estate, or agricultural loan."
      }
    ]
  },
  "bank manager": {
    "displayName": "Bank Manager",
    "items": [
      {
        "name": "Bank Manager",
        "code": "NE",
        "description": "Manages, directs, and coordinates activities of workers engaged in accounting and recording of financial transactions, setting up trust or escrow accounts, probating estates, and administering trust or mortgage accounts. Develops relationships with customers and business, community, and civic organizations to promote good will and generate new business."
      }
    ]
  },

  "bank teller": {
    "displayName": "Bank Teller",
    "items": [
      {
        "name": "Bank Teller",
        "code": "C-NC",
        "description": "PEncashes checks for bank customers and helps them deposit and withdraw money from their accounts. In small banks, tellers may also may sory checks, total credit and debit slips, and prepare specialized. They may keep loan recorcds, handle foreign monies, sell traveler's checks, or compute interests on savings accounts."
      }
    ]
  },


  "bank teller": {
    "displayName": "Bank Teller",
    "items": [
      {
        "name": "Bank Teller",
        "code": "C-NC",
        "description": "Encashes checks for bank customers and helps them deposit and withdraw money from their accounts. In small banks, tellers also may sort checks, total credit and debit slips, and prepare monthly statements for depositors. In large banks, tellers often specialize. They may keep loan records, handle foreign monies, sell traveler's checks, or compute interests on savings accounts."
      }
    ]
  },

  "barber/stylist": {
    "displayName": "Barber/Stylist",
    "items": [
      {
        "name": "Barber/Stylist",
        "code": "EM",
        "description": "Cuts and styles hair to suit each customer and may color or straighten hair and fit hairpieces. May offer hair and scalp treatments, shaves, facial massages, and shampoos."
      }
    ]
  },

  "billing typist": {
    "displayName": "Billing Typist",
    "items": [
      {
        "name": "Billing Typist",
        "code": "C",
        "description": "Compiles data and types invoices to be sent to customers, itemizing items sold, amounts due, credit terms, and date of shipment."
      }
    ]
  },

  "biochemist": {
    "displayName": "Biochemist",
    "items": [
      {
        "name": "Biochemist",
        "code": "NL",
        "description": "Studies chemical processes of living organisms. Conducts research to determine the action of foods, drugs, serums, hormones, and other substances on tissues and vital processes of living organisms."
      }
    ]
  },

  "biologist": {
    "displayName": "Biologist",
    "items": [
      {
        "name": "Biologist",
        "code": "L",
        "description": "Studies origin, growth, relationship, development, anatomy, evolution, functions, and other basic principles of plant and animal life. May specialize in research centering on a particular plant, animal, or aspect of biology."
      }
    ]
  },

  "biology teacher": {
    "displayName": "Biology Teacher",
    "items": [
      {
        "name": "Biology Teacher",
        "code": "IL",
        "description": "Teaches the science of life and life processes, including the study of structure, functioning, growth, origin, evolution, and distribution of living organisms, utilizing various teaching methods such as lecture, demonstration, and audiovisual aids to supplement presentations."
      }
    ]
  },

  "blood-bank technologist": {
    "displayName": "Blood-Bank Technologist",
    "items": [
      {
        "name": "Blood-Bank Technologist",
        "code": "C",
        "description": "A medical technologist who collects, classifies, stores, and processes blood. May also select and deliver suitable blood for transfusion."
      }
    ]
  },

  "book designer": {
    "displayName": "Book Designer",
    "items": [
      {
        "name": "Book Designer",
        "code": "CM",
        "description": "Specializes in the use of typography to transform a typewritten manuscript into a typeset book, balancing type and illustration on a page in order to produce the most effective publication possible."
      }
    ]
  },

  "book editor": {
    "displayName": "Book Editor",
    "items": [
      {
        "name": "Book Editor",
        "code": "CLE-LE",
        "description": "Secures and selects manuscripts and coordinates their publication in book form. Reviews submitted manuscripts, determines demand on the basis of consumer trends and personal knowledge, and makes recommendations regarding procurement and revision. Confers with publisher and author to arrange purchase and details such as publication date, royalties, and number of copies to be printed."
      }
    ]
  },

  "book-jacket designer": {
    "displayName": "Book-Jacket Designer",
    "items": [
      {
        "name": "Book-Jacket Designer",
        "code": "M",
        "description": "Needs a strong sense of design and a knowledge of the latest developments in typography and lettering to create the cover of a book."
      }
    ]
  },

  "bookkeeper": {
    "displayName": "Bookkeeper",
    "items": [
      {
        "name": "Bookkeeper",
        "code": "NC",
        "description": "Keeps a complete set of records of financial transactions of an establishment. May maintain records in journals or ledgers or on accounting forms. Duties vary with the size of the business."
      }
    ]
  },

  "botanist": {
    "displayName": "Botanist",
    "items": [
      {
        "name": "Botanist",
        "code": "L",
        "description": "Studies development and life processes, physiology, heredity, environment, distribution, anatomy, morphology, and economic value of plants for application in such fields as agronomy, forestry, horticulture, and pharmacology."
      }
    ]
  },

  "branch-bank operations officer": {
    "displayName": "Branch-Bank Operations Officer",
    "items": [
      {
        "name": "Branch-Bank Operations Officer",
        "code": "LE-ILE-NIE",
        "description": "Plans, coordinates, controls the workflow, updates systems, strives for administrative efficiency, and is responsible for all functions of a branch office."
      }
    ]
  },

  "broadcasting announcer": {
    "displayName": "Broadcasting Announcer",
    "items": [
      {
        "name": "Broadcasting Announcer",
        "code": "EM",
        "description": "Introduces musical selections, guests, and programs, and delivers most of the live commercial messages. In small stations, the broadcasting announcer may also operate the control board, sell time, and write commercial and news copy."
      }
    ]
  },

  "broadcasting director": {
    "displayName": "Broadcasting Director",
    "items": [
      {
        "name": "Broadcasting Director",
        "code": "EM",
        "description": "Plans and supervises individual programs or series of programs, coordinates the shows, selects artists and studio personnel, schedules and conducts rehearsals, and directs on-the-air shows."
      }
    ]
  },
  "building contractor": {
    "displayName": "Building Contractor",
    "items": [
      {
        "name": "Building Contractor",
        "code": "LEM-NEM",
        "description": "Contracts to perform specified construction work in accordance with architect’s plans, blueprints, codes, and other specifications. Estimates costs of materials, labor, and use of equipment required to fulfill provisions of contract and prepares bids. Confers with clients to negotiate terms of contract. Supervises workers directly or through subordinate supervisors."
      }
    ]
  },
  "building inspector": {
    "displayName": "Building Inspector",
    "items": [
      {
        "name": "Building Inspector",
        "code": "CEM-CM",
        "description": "Inspects new and existing buildings and structures to enforce conformance to building, grading, and zoning laws and approved plans, specifications, and standards. Keeps inspection records and prepares reports for use by administrative or judicial authorities."
      }
    ]
  },
  "business agent": {
    "displayName": "Business Agent",
    "items": [
      {
        "name": "Business Agent",
        "code": "NIE",
        "description": "Manages financial affairs of entertainers and negotiates with agents and representatives for contracts and appearances."
      }
    ]
  },
  "business analyst": {
    "displayName": "Business Analyst",
    "items": [
      {
        "name": "Business Analyst",
        "code": "LE",
        "description": "Is responsible for developing and applying sound analytical techniques to business problems, providing input to investment decisions, and acting as financial consultant to product managers. Assists the marketing organizations in terms of the most economical means of getting products to customers, determines whether certain products should be continued or abandoned, analyzes recent trends, and forecasts future results."
      }
    ]
  },
  "business consultant": {
    "displayName": "Business Consultant",
    "items": [
      {
        "name": "Business Consultant",
        "code": "ILE",
        "description": "Consults with clients to define business needs or problems, conducts studies and surveys to obtain data and analyzes data to advise on or recommend solutions, utilizing knowledge of theory principles, or technology of specific disciplines."
      }
    ]
  },
  "bus station manager": {
    "displayName": "Bus-Station Manager",
    "items": [
      {
        "name": "Bus-Station Manager",
        "code": "CE",
        "description": "Directs and coordinates activities of motor bus company to provide passengers with fast, efficient, and safe transportation."
      }
    ]
  },
  "cabinetmaker": {
    "displayName": "Cabinetmaker",
    "items": [
      {
        "name": "Cabinetmaker",
        "code": "NEM-M",
        "description": "Cuts, shapes, and assembles wooden articles such as store fixtures, office equipment, cabinets, and high grade furniture. May set up and operate variety of machines such as power saws, jointers, mortisers, tenoners, molders, and shapers to cut and shape lumber or shape parts from wood stock."
      }
    ]
  },
  "cardiologist": {
    "displayName": "Cardiologist",
    "items": [
      {
        "name": "Cardiologist",
        "code": "NIL-IL",
        "description": "Treats diseases of the heart and its functions. Prescribes medications and recommends dietary and work-activity program, as indicated. May engage in research to study anatomy of and diseases peculiar to the heart."
      }
    ]
  },
  "cardiovascular physician": {
    "displayName": "Cardiovascular Physician",
    "items": [
      {
        "name": "Cardiovascular Physician",
        "code": "NIL-IL",
        "description": "Diagnoses and treats diseases of the heart and blood vessels."
      }
    ]
  },
  "cartoonist": {
    "displayName": "Cartoonist",
    "items": [
      {
        "name": "Cartoonist",
        "code": "ILM-IM",
        "description": "Possesses a unique, humorous or dramatic point of view and the ability to illustrate it in a direct and economical pen-and-ink technique. In most cases, the ability to write is essential. May do spot drawings or gag or satirical cartoons on a freelance basis, have a staff job for a publication, or be syndicated as a comic-strip artist or political cartoonist."
      }
    ]
  },
  "caterer": {
    "displayName": "Caterer",
    "items": [
      {
        "name": "Caterer",
        "code": "NE",
        "description": "Coordinates food-service activities of hotel, restaurant, or similar establishment or at social functions. Estimates food and beverages costs and requisitions or purchases supplies. Directs hiring and assignment of personnel. Investigates and resolves food quality and service complaints."
      }
    ]
  },
  "certified public accountant": {
    "displayName": "Certified Public Accountant",
    "items": [
      {
        "name": "Certified Public Accountant",
        "code": "CLE-CEM-NLE",
        "description": "Prepares and analyzes financial reports for clients. A certified public accountant may work for accounting firm or have own business."
      }
    ]
  },
  "chef": {
    "displayName": "Chef",
    "items": [
      {
        "name": "Chef",
        "code": "EM",
        "description": "Supervises, coordinates, and participates in activities of cooks and other kitchen personnel engaged in preparing and cooking foods in hotel restaurant, cafeteria, or other establishment."
      }
    ]
  },
  "chemical engineer": {
    "displayName": "Chemical Engineer",
    "items": [
      {
        "name": "Chemical Engineer",
        "code": "NLM",
        "description": "Designs chemical plant equipment and devises processes for manufacturing chemicals and products such as gasoline, synthetic rubber, plastics, detergents, cement, paper, and pulp. Applies principles and technology of chemistry, physics, and engineering."
      }
    ]
  },
  "chemist": {
    "displayName": "Chemist",
    "items": [
      {
        "name": "Chemist",
        "code": "NL",
        "description": "Studies substances and materials. Tests substances to find out what they are made of and to see how they respond to other substances. Uses their knowledge to develop chemical compounds and to improve products and processes. Most chemists work in research and development. However, some work in other areas such as production and inspection, sales, consulting, and teaching."
      }
    ]
  },
  "chief petroleum engineer": {
    "displayName": "Chief Petroleum Engineer",
    "items": [
      {
        "name": "Chief Petroleum Engineer",
        "code": "NEM",
        "description": "Plans and directs engineering activities of a petroleum company to develop oil fields and produce oil and gas."
      }
    ]
  },
  "child psychologist": {
    "displayName": "Child Psychologist",
    "items": [
      {
        "name": "Child Psychologist",
        "code": "IL",
        "description": "Diagnoses or evaluates mental and emotional disorders of children and administers programs of treatments. Conducts diagnostic studies to identify child’s needs, limitations, and potentials, observing child in a play or other situations. May administer and score psychological tests."
      }
    ]
  },
  "chiropractor": {
    "displayName": "Chiropractor",
    "items": [
      {
        "name": "Chiropractor",
        "code": "ILM",
        "description": "Adjusts spinal column and other articulations of body to prevent disease and correct abnormalities of human body believed to be caused by interference with nervous system. May utilize supplementary measures such as exercise, rest, water, light, heat, and nutritional therapy."
      }
    ]
  },
  "city planning engineer": {
    "displayName": "City-Planning Engineer",
    "items": [
      {
        "name": "City-Planning Engineer",
        "code": "LEM - NLE - NEM",
        "description": "Develops comprehensive plans and programs for utilization of land and physical facilities of cities and metropolitan areas. Compiles and analyzes data on economic, social and physical factors affecting land use. Prepares requisition graphic and narrative reports on data."
      }
    ]
  },
  "civil engineer": {
    "displayName": "Civil Engineer",
    "items": [
      {
        "name": "Civil Engineer",
        "code": "NLM",
        "description": "Plans, designs, and supervises the construction and maintenance of structures and facilities such as buildings, roads, railroads, harbors, airports, water and sewage systems, bridges, and dams. May do such things as conducting research, advising on engineering problems, preparing technical reports and materials, and teaching. Includes architectural, structural, traffic, ocean, and geo-technical engineers."
      }
    ]
  },
  "clothes designer": {
    "displayName": "Clothes Designer",
    "items": [
      {
        "name": "Clothes Designer",
        "code": "EM",
        "description": "Designs garments, shoes, handbags, and other apparel and accessories. Makes rough and detailed drawings and writes specifications describing factors such as color scheme, constructions, and type of material to be used. Analyzes trends, confers with sales and management executives, compares apparel materials, and integrates findings with personal interests, tastes, and knowledge of design to create new apparel designs."
      }
    ]
  },
  "commercial broker": {
    "displayName": "Commercial Broker",
    "items": [
      {
        "name": "Commercial Broker",
        "code": "E",
        "description": "Specializes in selling or leasing income-producing business properties such as apartment and office buildings, retail stores, and warehouses."
      }
    ]
  },
  "commercial photographer": {
    "displayName": "Commercial Photographer",
    "items": [
      {
        "name": "Commercial Photographer",
        "code": "EM",
        "description": "May specialize in a particular type of photography such as illustrative, fashion, architectural, or portrait."
      }
    ]
  },
  "computer applications engineer": {
    "displayName": "Computer-Applications Engineer",
    "items": [
      {
        "name": "Computer-Applications Engineer",
        "code": "NLM-N",
        "description": "Formulates mathematical models of systems, and sets up and controls analog or hybrid computer system to solve scientific and engineering problems. Prepares technical reports describing step-by-step solution of problems. Develops new techniques for solving problems."
      }
    ]
  },
  "computer programmer": {
    "displayName": "Computer Programmer",
    "items": [
      {
        "name": "Computer Programmer",
        "code": "CL-NCL-L",
        "description": "Converts project specifications and statements of problems and procedures to detailed logical flow charts for coding into computer language. Develops and writes computer programs to store, locate, and retrieve specific documents, data, and information. May program web sites."
      }
    ]
  },
  "computer system analyst": {
    "displayName": "Computer System Analyst",
    "items": [
      {
        "name": "Computer System Analyst",
        "code": "NL",
        "description": "Analyzes science, engineering, business, and all other data processing problems for application to electronic data processing systems. Studies user requirements, procedures, and problems to automate or improve existing systems and review computer system capabilities, workflow, and scheduling limitations. May analyze or recommend commercially available software. May supervise computer programmers."
      }
    ]
  },
  "construction electrician": {
    "displayName": "Construction Electrician",
    "items": [
      {
        "name": "Construction Electrician",
        "code": "M",
        "description": "Assembles, installs, and wires electrical systems that operate lighting, power, air-conditioning, and refrigeration components."
      }
    ]
  },
  "construction inspector": {
    "displayName": "Construction Inspector",
    "items": [
      {
        "name": "Construction Inspector",
        "code": "CM",
        "description": "Ensures compliance with building codes and ordinances, zoning regulations and contract specifications, in public and private construction."
      }
    ]
  },
  "construction materials supervisor": {
    "displayName": "Construction-Materials Supervisor",
    "items": [
      {
        "name": "Construction-Materials Supervisor",
        "code": "NCM",
        "description": "Is responsible for ordering building supplies such as steel, lumber, cement, gravel, sand, tiles, and glass."
      }
    ]
  },
  "costume designer": {
    "displayName": "Costume Designer",
    "items": [
      {
        "name": "Costume Designer",
        "code": "M",
        "description": "Conducts research and designs authentic period, country, or social-class costumes to be worn by motion picture, television, concert, stage, and other media performers."
      }
    ]
  },
  "counseling psychologist": {
    "displayName": "Counseling Psychologist",
    "items": [
      {
        "name": "Counseling Psychologist",
        "code": "IL",
        "description": "Provides individual and group counseling services to assist individuals in achieving more effective personal, social, educational, and vocational development and adjustment. May engage in research to develop and improve diagnostic and counseling techniques. May administer and score psychological tests."
      }
    ]
  },
  "criminologist": {
    "displayName": "Criminologist",
    "items": [
      {
        "name": "Criminologist",
        "code": "L",
        "description": "Specializes in research on relationship between criminal law and social order in causes of crime and behavior of criminals."
      }
    ]
  },
  "customer service representative call center agent": {
    "displayName": "Customer-Service Representative/ Call Center Agent",
    "items": [
      {
        "name": "Customer-Service Representative/ Call Center Agent",
        "code": "E",
        "description": "Provides information to customers in response to inquiries about products and services. May also handle customer complaints."
      }
    ]
  },
  "customs inspector": {
    "displayName": "Customs Inspector",
    "items": [
      {
        "name": "Customs Inspector",
        "code": "C",
        "description": "Inspects cargo, baggage, articles worn or carried by persons, and vessels, vehicles, or aircraft entering or leaving the country to enforce customs and related laws."
      }
    ]
  },
  "database manager": {
    "displayName": "Database Manager",
    "items": [
      {
        "name": "Database Manager",
        "code": "L-NL",
        "description": "Analyzes, manipulates, and coordinates “hard” data for efficient use by researchers and management."
      }
    ]
  },
  "dental assistant": {
    "displayName": "Dental Assistant",
    "items": [
      {
        "name": "Dental Assistant",
        "code": "CIM-IM",
        "description": "Works with dentists as they examine and treat patients. Makes the patients comfortable in the dental chair, prepares them for treatment, and obtains their dental records. May hand the dentist the proper tools and materials and keep patients’ mouths clear by using suction or other devices. Prepares materials for making impressions and restorations, and processes X-ray film. Also instructs patients in oral health and prepares instruments for stabilization. Some perform clerical duties as well."
      }
    ]
  },
  "dentist": {
    "displayName": "Dentist",
    "items": [
      {
        "name": "Dentist",
        "code": "ILM-NIM",
        "description": "Diagnoses and treats diseases, injuries, and malformations of teeth and gums and related oral structures. Treats diseases of nerve, pulp, and other dental tissues affecting vitality of teeth. Takes X-rays, fills cavities, straightens teeth, and treats gum diseases. Pulls teeth and replaces them with dentures. Also performs surgery on gums and supporting bones to correct them. Most practice general dentistry, but a few specialize in areas of care such as children’s dentistry or the treatment of gums. A few dentists teach in dental schools, do research, or run dental health programs."
      }
    ]
  },
  "dermatologist": {
    "displayName": "Dermatologist",
    "items": [
      {
        "name": "Dermatologist",
        "code": "IL",
        "description": "Diagnoses and treats diseases of human skin. Examines skin to determine nature of disease, taking blood samples and smears from affected areas and performing other laboratory procedures."
      }
    ]
  },
  "design engineer": {
    "displayName": "Design Engineer",
    "items": [
      {
        "name": "Design Engineer",
        "code": "LM-NLM",
        "description": "Designs machinery, products, systems, and processes for efficient and economical performance. Designs industrial machinery and equipment used to manufacture goods. Designs, plans, supervises the construction of buildings, highways, and rapid-transit systems. Designs and develops consumer products such as automobiles, television sets, and refrigerators, and systems for control and automation for manufacturing, business, and management processes."
      }
    ]
  },
  "diagnostic x ray technologist": {
    "displayName": "Diagnostic X-Ray Technologist",
    "items": [
      {
        "name": "Diagnostic X-Ray Technologist",
        "code": "LM-M",
        "description": "Operates X-ray equipment to make radiographs (on X-ray film) of various parts of the body. These are used by the physician in determining the extent of the patient’s illness or injury."
      }
    ]
  },
  "dialysis technician": {
    "displayName": "Dialysis Technician",
    "items": [
      {
        "name": "Dialysis Technician",
        "code": "NIM-IM",
        "description": "Sets up and operates artificial-kidney machine to provide dialysis treatment for patients with kidney disorders or failures. May assist with surgical insertion of shunts into vein and artery of patient’s arm or leg. May explain dialysis procedure and operation of kidney’s machine to patient before first treatment to allay apprehension or fear of dialysis."
      }
    ]
  },
  "dietitian": {
    "displayName": "Dietitian",
    "items": [
      {
        "name": "Dietitian",
        "code": "CIL",
        "description": "Plans nutritious and appetizing meals to help people maintain or recover good health. Confers with physicians about patients’ nutritional care and instructs patients and their families on the importance of diet."
      }
    ]
  },
  "directory assistance operator": {
    "displayName": "Directory-Assistance Operator",
    "items": [
      {
        "name": "Directory-Assistance Operator",
        "code": "C",
        "description": "Provides telephone information from cord or cordless central-office switchboard. May keep record of calls received, and alphabetical or geographical reels and directories up-to-date."
      }
    ]
  },
  "drafter draftsman": {
    "displayName": "Drafter/Draftsman",
    "items": [
      {
        "name": "Drafter/Draftsman",
        "code": "CLM-NLM-NM",
        "description": "Prepares detailed drawings of architectural and structural features of buildings or drawings and topographical relief maps used in civil engineering projects such as highways, bridges, and public works. Uses knowledge of building materials, engineering practices, and mathematics to complete drawings."
      }
    ]
  },
  "economist": {
    "displayName": "Economist",
    "items": [
      {
        "name": "Economist",
        "code": "NCE-NLE-NCL",
        "description": "Studies the way a society uses resources such as land, labor, raw materials, and machinery to provide goods and services. Plans and conducts research to determine the costs and benefits of making, distributing, and using resources in a particular way. Some develop theories and models to explain problems such as inflation. Most, however, apply their skills to solve problems in a certain area, such as finance, labor, agriculture, or health. Gives economic advice to business firms, insurance companies, banks, and others. May collect statistical data using econometric and sampling techniques."
      }
    ]
  },
  "electrical engineer": {
    "displayName": "Electrical Engineer",
    "items": [
      {
        "name": "Electrical Engineer",
        "code": "NLM",
        "description": "Conducts research and development activities concerned with design, manufacture, and testing of electrical components, equipment, and systems, application of equipment to new uses, manufacture, construction, and installation of electrical equipment, facilities, and systems."
      }
    ]
  },
  "electrician": {
    "displayName": "Electrician",
    "items": [
      {
        "name": "Electrician",
        "code": "LM",
        "description": "Installs, maintains, and repairs electrical wiring, equipment, and fixtures. Ensures that work is in accordance with relevant codes. May install or service street lights, intercom systems, or electrical control systems."
      }
    ]
  },
  "electronics engineer": {
    "displayName": "Electronics Engineer",
    "items": [
      {
        "name": "Electronics Engineer",
        "code": "NLM",
        "description": "Researches, designs, develops, and tests electronic components and systems for commercial, industrial, military, or scientific use. May apply knowledge of electronic theory and materials properties. May design electronic circuits and components for use in fields such as telecommunications, aerospace guidance and propulsion control, acoustics, or instruments and controls."
      }
    ]
  },
  "electronic-techinician": {
    "displayName": "Electronic-Techinician",
    "items": [
      {
        "name": "Electronic-Techinician",
        "code": "CLM-CM",
        "description": "Helps engineers design and build experimental models, sets up and repairs equipment for customers, and can do complex inspection and assembly work."
      }
    ]
  },
  "electroplater": {
    "displayName": "Electroplater",
    "items": [
      {
        "name": "Electroplater",
        "code": "MN",
        "description": "Studies the job specifications which indicate the parts of the object to be plated, the type of plating metal to be applied, and the desired thickness of the plating, and then treats these parts in electrolytic and chemical baths to prevent corrosion."
      }
    ]
  },
  "elementary-school-teacher": {
    "displayName": "Elementary-School Teacher",
    "items": [
      {
        "name": "Elementary-School Teacher",
        "code": "CE-CLE-CIE",
        "description": "Provides high-level administrative support by conducting research, preparing statistical reports, handling information requests, and performing clerical functions such as preparing correspondence, receiving visitors, arranging conference calls, and scheduling meetings. May also train and supervise lower-level clerical staff."
      }
    ]
  },
  "farm-manager": {
    "displayName": "Farm Manager",
    "items": [
      {
        "name": "Farm Manager",
        "code": "FE",
        "description": "Schedules the plowing, fertilizing, planting, cultivation and harvesting of fields, and the marketing of crops and livestock for absentee landowners and their tenants."
      }
    ]
  },
  "fashion-coordinator": {
    "displayName": "Fashion Coordinator",
    "items": [
      {
        "name": "Fashion Coordinator",
        "code": "EM",
        "description": "Promotes new fashion and coordinates promotional activities to induce consumer acceptance. Studies fashion and trade journals, travels to garment centers, attends fashion shows, and visits manufacturers and merchandise markets to obtain information on fashion trends. Consults with buyer regarding the type of fashion store to be purchased and feature for season."
      }
    ]
  },
  "fashion-designer": {
    "displayName": "Fashion Designer",
    "items": [
      {
        "name": "Fashion Designer",
        "code": "EM",
        "description": "Creates new types and styles of apparel. In addition of creativity, designer must have practical knowledge of the apparel business so that new fashion ideas can be produced at competitive prices."
      }
    ]
  },
  "file-clerk": {
    "displayName": "File Clerk",
    "items": [
      {
        "name": "File Clerk",
        "code": "C",
        "description": "Files correspondence, card invoices, receipts, and other records in alphabetical or numerical order, or according to subject matter, phonetic spelling, or other system."
      }
    ]
  },
  "film-editor": {
    "displayName": "Film Editor",
    "items": [
      {
        "name": "Film Editor",
        "code": "LM",
        "description": "Edits and arranges film footage to create a coherent narrative. May work with directors to achieve the desired visual style and pacing."
      }
    ]
  },
  "financial-analyst": {
    "displayName": "Financial Analyst",
    "items": [
      {
        "name": "Financial Analyst",
        "code": "NLE",
        "description": "Conducts statistical analyses of information affecting investment programs of public or private institutions and private individuals. Interprets economic data, gathers information, and makes recommendation about investment timing."
      }
    ]
  },
  "financial-planner": {
    "displayName": "Financial Planner",
    "items": [
      {
        "name": "Financial Planner",
        "code": "NLE",
        "description": "Develops and implements financial plans for individuals, businesses, and organizations, using knowledge of tax and real estate. Analyzes client's financial status, develops financial plan based on analysis, and discusses options with clients."
      }
    ]
  },
  "fire-inspector": {
    "displayName": "Fire Inspector",
    "items": [
      {
        "name": "Fire Inspector",
        "code": "CE-CEM",
        "description": "Inspects buildings and equipment to detect fire hazards and enforce local ordinances and government laws. Discusses condition with owner or manager and recommends safe methods of storing flammables or other hazardous materials. Issues summons for fire hazards not corrected on subsequent inspection and enforces code when owner refuses to cooperate."
      }
    ]
  },
  "executive secretary": {
    "displayName": "Executive Secretary",
    "items": [
      {
        "name": "Executive Secretary",
        "code": "IL-L",
        "description": "Provides administrative support to executives or management teams. May handle correspondence, schedule meetings, prepare reports, and manage other office-related tasks."
      }
    ]
  },
  "food and beverage manager": {
    "displayName": "Food-and-Beverage Manager",
    "items": [
      {
        "name": "Food-and-Beverage Manager",
        "code": "NE",
        "description": "Coordinates food-service activities of hotel or restaurant, or at social functions. Estimates food and beverage costs. Confers with food preparation and other personnel to plan menus and related activities such as dining room, bar, and banquet operations. Directs hiring and assignment of personnel."
      }
    ]
  },
  "foreign correspondent": {
    "displayName": "Foreign Correspondent",
    "items": [
      {
        "name": "Foreign Correspondent",
        "code": "LE",
        "description": "Gathers newsworthy information in foreign countries to write articles for publication by newspapers, press services, and magazines. May interview people, review public records, attend events, and do research to describe, analyze, and interpret information."
      }
    ]
  },
  "front office hotel manager": {
    "displayName": "Front-Office Hotel Manager",
    "items": [
      {
        "name": "Front-Office Hotel Manager",
        "code": "E",
        "description": "Coordinates front-office activities of hotel and resolves problems arising from guests’ complaints, reservation and room-assignment activities, and unusual requests and inquiries. Assigns duties and shifts to workers and observes performance to ensure adherence to hotel policies."
      }
    ]
  },
  "geologist": {
    "displayName": "Geologist",
    "items": [
      {
        "name": "Geologist",
        "code": "NLM",
        "description": "Research scientist who studies the physical aspects of the earth, including its origin, history, composition, and structure. Obtains physical data by drilling and by collecting and examining rocks and other samples."
      }
    ]
  },
  "goldsmith": {
    "displayName": "Goldsmith",
    "items": [
      {
        "name": "Goldsmith",
        "code": "M",
        "description": "Fabricates and repairs jewelry articles such as rings, brooches, pendants, bracelets, and lockets. Enlarges or reduces size of rings. Repairs broken clasps, pins, rings, and other jewelry by soldering or replacing broken parts, and reshapes and restyles old jewelry, following designs or instructions."
      }
    ]
  },
  "graphic designer": {
    "displayName": "Graphic Designer",
    "items": [
      {
        "name": "Graphic Designer",
        "code": "LM",
        "description": "Creates graphics to meet specific commercial or promotional needs such as packaging, displays, or logos. May use a variety of mediums to achieve artistic or decorative effects."
      }
    ]
  },
  "guidance counselor": {
    "displayName": "Guidance Counselor",
    "items": [
      {
        "name": "Guidance Counselor",
        "code": "CIL-IL",
        "description": "Plans and supervises testing program in school system and devises and directs use of records, reports, and other materials essential to program. Supervises school placement service. Counsels students on referral basis relative to educational and vocational objectives and personal and social problems."
      }
    ]
  },
  "gynecologist": {
    "displayName": "Gynecologist",
    "items": [
      {
        "name": "Gynecologist",
        "code": "ILM-IL",
        "description": "Diagnoses and treats diseases and disorders of female genital, urinary, and rectal organs. Uses physical and radiological examination findings, laboratory results, and patient’s statements as diagnostic aids. Discusses problems with patient, and prescribes medication, appropriate exercise, or hygienic regime, or performs surgery as needed to correct malfunctions or remove diseased organ. May care for patient throughout pregnancy and deliver babies."
      }
    ]
  },
  "head nurse": {
    "displayName": "Head Nurse",
    "items": [
      {
        "name": "Head Nurse",
        "code": "CLE-CIE-ILE",
        "description": "Directs nursing activities, assigns duties, and coordinates nursing services. Directs preparation and maintenance of patients’ clinical records. Inspects rooms and wards for cleanliness and comfort. Accompanies physician on rounds, and keeps informed on special orders concerning patients. Orders or directs ordering of drugs, solutions, and equipment, and maintains records on narcotics."
      }
    ]
  },
  "high school principal": {
    "displayName": "High-School Principal",
    "items": [
      {
        "name": "High-School Principal",
        "code": "E-IE",
        "description": "Directs and coordinates educational, administrative, and counseling activities of secondary school. Confers with teaching personnel, pupils, and parents on matters pertaining to educational and behavioral problems. Establishes and maintains relationships with colleges, community organizations, and other schools to coordinate educational services."
      }
    ]
  },
  "historian": {
    "displayName": "Historian",
    "items": [
      {
        "name": "Historian",
        "code": "CL",
        "description": "Prepares a chronological record of events dealing with some phase of human activity, in terms of either individuals or social, ethnic, political, or geographic groupings. Consults sources of information such as historical indexes and catalogs, archives, court records, diaries, news files, and miscellaneous published materials. Organizes and evaluates data on basis of authenticity and relative significance."
      }
    ]
  },
  "hospital administrator": {
    "displayName": "Hospital Administrator",
    "items": [
      {
        "name": "Hospital Administrator",
        "code": "LE",
        "description": "Administers, directs, and develops hospital programs or services for scientific research, preventive medicine, medical and vocational rehabilitation, and community health and welfare promotion. Administers fiscal operations such as budget planning, accounting, and establishing rates for hospital services. Directs hiring and training of personnel and coordinates activities of medical, nursing, and administrative staffs and services."
      }
    ]
  },
  "hotel bell captain": {
    "displayName": "Hotel Bell Captain",
    "items": [
      {
        "name": "Hotel Bell Captain",
        "code": "CE",
        "description": "Determines work schedules and keeps time records of bellmen. Instructs workers regarding requests from guests concerning hotel facilities, local merchants, and attractions. Furnishes information, makes reservations, and obtains tickets for guests to social and recreational events or for travel."
      }
    ]
  },
  "hotel manager": {
    "displayName": "Hotel Manager",
    "items": [
      {
        "name": "Hotel Manager",
        "code": "E",
        "description": "Establishes standards for personnel administration and performance, service to clients, room rates, advertising, publicity, credit, food selection and service, and type of patronage to be solicited. Plans dining room, bar, and banquet operations. Allocates funds, authorizes expenditures, and assists in planning budgets for departments."
      }
    ]
  },
  "immigration lawyer": {
    "displayName": "Immigration Lawyer",
    "items": [
      {
        "name": "Immigration Lawyer",
        "code": "LE-ILE",
        "description": "A specialized attorney working with foreign governments, consulates, and embassies regarding residency requirements, employment procedures, naturalizations, and requirements for immigration."
      }
    ]
  },
  "industrial engineer": {
    "displayName": "Industrial Engineer",
    "items": [
      {
        "name": "Industrial Engineer",
        "code": "LEM-NLE-NLM",
        "description": "Plans utilization of production facilities and personnel to improve efficiency of operations in industrial establishment. Establishes work-measurement programs and makes sample observations of work to develop standards of manpower utilization. Analyzes utilization of manpower and machines in units and develops work-simplification programs."
      }
    ]
  },
  "information clerk": {
    "displayName": "Information Clerk",
    "items": [
      {
        "name": "Information Clerk",
        "code": "C",
        "description": "Provides information and answers inquiries of persons coming into establishment regarding activities conducted at establishment, and location of departments, offices, and employees within organization."
      }
    ]
  },
  "insurance agent": {
    "displayName": "Insurance Agent",
    "items": [
      {
        "name": "Insurance Agent",
        "code": "E",
        "description": "Sells life, property, casualty, health, automotive, or other types of insurance. They may refer clients to independent brokers, work as independent broker, or be employed by an insurance company."
      }
    ]
  },
  "interior designer": {
    "displayName": "Interior Designer",
    "items": [
      {
        "name": "Interior Designer",
        "code": "EM",
        "description": "Plans, designs, and furnishes interiors of residential, commercial, or industrial buildings. Formulates design which is practical, aesthetic, and supports client’s goals, such as raising productivity, selling merchandise, or improving lifestyle. They may specialize in a particular field, style, or phase of interior design."
      }
    ]
  },
  "internal revenue agent": {
    "displayName": "Internal Revenue Agent",
    "items": [
      {
        "name": "Internal Revenue Agent",
        "code": "NCL",
        "description": "Conducts independent field audits and investigations of income-tax returns to verify or amend tax liabilities. Analyzes accounting books and records to determine appropriateness of accounting methods employed and compliance with statutory provisions. Investigates documents, financial transactions, operation methods, industry practices and such legal instruments as vouchers, leases, contracts, and wills, to develop information regarding inclusiveness of accounting records and tax returns."
      }
    ]
  },
  "international banker": {
    "displayName": "International Banker",
    "items": [
      {
        "name": "International Banker",
        "code": "NE",
        "description": "Maintains bank’s balances on deposit in foreign banks to ensure foreign-exchange position, determines prices at which such exchange shall be purchased and sold, based on demand, supply, and stability of currency. Establishes local rates based on money-market quotations or customer’s financial standing."
      }
    ]
  },
  "jeweler": {
    "displayName": "Jeweler",
    "items": [
      {
        "name": "Jeweler",
        "code": "E-EM",
        "description": "May design, make, repair, or sell jewelry. Many jewelers combine all these different aspects of the business. Works with precious stones, synthetics, silver, gold, platinum, or other metals."
      }
    ]
  },
  "judge": {
    "displayName": "Judge",
    "items": [
      {
        "name": "Judge",
        "code": "IL",
        "description": "Arbitrates disputes, advises counsel, litigants, or court personnel, and administers judicial system. Reads or listens to allegations made by plaintiff in civil suits to determine their sufficiency. Examines evidence in criminal cases to determine if evidence will support charge. Sentences defendant in criminal cases according to statutes."
      }
    ]
  },
  "kindergarten teacher": {
    "displayName": "Kindergarten Teacher",
    "items": [
      {
        "name": "Kindergarten Teacher",
        "code": "I",
        "description": "Teaches elementary, natural, and social sciences, personal hygiene, music, art, and literature to children from four to six years old to promote their physical, mental, and social development. Observes children to detect signs of ill health or emotional disturbances, and to evaluate progress."
      }
    ]
  },
  "laboratory assistant": {
    "displayName": "Laboratory Assistant",
    "items": [
      {
        "name": "Laboratory Assistant",
        "code": "CLM-NCL-NCM",
        "description": "Performs duties according to type of research in which supervising scientist is engaged. Prepares samples for analysis or examination and performs routine laboratory tests."
      }
    ]
  },
  "landscape architect": {
    "displayName": "Landscape Architect",
    "items": [
      {
        "name": "Landscape Architect",
        "code": "LEM-NEM",
        "description": "Plans and designs land areas for such projects as parks and other recreational facilities, airports, highways, hospitals, schools, land subdivisions, and commercial, industrial, and residential sites."
      }
    ]
  },
  "land surveyor": {
    "displayName": "Land Surveyor",
    "items": [
      {
        "name": "Land Surveyor",
        "code": "NCM",
        "description": "Plans, organizes, and directs work of one or more survey parties engaged in surveying to determine precise location and measurements of points, elevations, lines, areas, and contours for construction, mapmaking, land division, titles, mining, or other purposes."
      }
    ]
  },
  "lawyer": {
    "displayName": "Lawyer",
    "items": [
      {
        "name": "Lawyer",
        "code": "ILE-IL",
        "description": "Advises individuals and businesses on legal matters. Consults with clients to determine the details of problems, advises them of the law, and suggests action that might be taken. Also studies and interprets laws, drafts legal papers, and represents clients in courts of law. Lawyers may specialize in a single area of law such as business or family, or may practice broadly in many areas of the law. Some help write laws and establish ways to enforce them. A few teach or hold management positions."
      }
    ]
  },
  "legal assistant": {
    "displayName": "Legal Assistant",
    "items": [
      {
        "name": "Legal Assistant",
        "code": "CE-CIE-C-CL-CIL",
        "description": "Researches law, investigates facts, and prepares documents to assist lawyer. Appraises and inventories real and personal property for estate planning. Delivers or directs delivery of subpoenas to witnesses and parties to action."
      }
    ]
  },
  "librarian": {
    "displayName": "Librarian",
    "items": [
      {
        "name": "Librarian",
        "code": "CLE-CL",
        "description": "Administers libraries and performs various library services. Works in a variety of settings, including public libraries, schools, colleges and universities, museums, corporations, government agencies, law firms, non-profit organizations, and healthcare providers. Tasks may include selecting, acquiring, cataloguing, classifying, circulating, and maintaining library materials; and furnishing reference, bibliographical, and readers’ advisory services. May perform in-depth, strategic research, and synthesize, analyze, edit, and filter information. May set up or work with databases and information systems to catalogue and access information."
      }
    ]
  },
  "loan officer": {
    "displayName": "Loan Officer",
    "items": [
      {
        "name": "Loan Officer",
        "code": "LE-NLE",
        "description": "Examines, evaluates, authorizes, or recommends approval of customer applications for lines of credit, commercial loans, or credit-card accounts. May supervise loan personnel, handle foreclosure proceedings, analyze potential loan markets to develop prospects for loans and buy and sell contracts, loans, or real estate."
      }
    ]
  },
  "marine biologist": {
    "displayName": "Marine Biologist",
    "items": [
      {
        "name": "Marine Biologist",
        "code": "L",
        "description": "Studies the plant and animal species living in the oceanic environment. Searches for new foods and drugs from the ocean, studies effects of pollution, and tries to find better ways of raising crops in experimental underwater farms."
      }
    ]
  },
  "mathematics teacher": {
    "displayName": "Mathematics Teacher",
    "items": [
      {
        "name": "Mathematics Teacher",
        "code": "NIL-NI",
        "description": "Studies, organizes, and teaches mathematical principles and procedures to students in an effective and meaningful manner. Evaluates student achievement and progress."
      }
    ]
  },
  "mechanical engineer": {
    "displayName": "Mechanical Engineer",
    "items": [
      {
        "name": "Mechanical Engineer",
        "code": "NLM",
        "description": "Plans, designs, and develops tools, engines, machines, and other equipment. Directs the installation, use, upkeep, and repair of equipment used in heat, gas, water, and steam systems. Many specialize in a certain product area such as motor vehicles, marine equipment, heating and cooling units, or plastics. Some conduct research, do sales work, or teach."
      }
    ]
  },
  "medical assistant": {
    "displayName": "Medical Assistant",
    "items": [
      {
        "name": "Medical Assistant",
        "code": "CIL-CI",
        "description": "Performs administrative and certain clinical duties under the direction of a physician. Administrative duties may include scheduling appointments, maintaining medical records, billing, and coding for insurance purposes. Clinical duties may include taking and recording vital signs and medical histories, preparing patients for examination, drawing blood, and administering medications as directed by a physician."
      }
    ]
  },
  "medical technologist": {
    "displayName": "Medical Technologist",
    "items": [
      {
        "name": "Medical Technologist",
        "code": "NCL",
        "description": "Performs complicated chemical, microscopic, and bacteriological tests to provide data for use in treatment and diagnosis of disease. The medical technologist examines body fluids microscopically, makes cultures of body-fluid or tissue samples to determine the presence of bacteria, parasites, or other microorganisms, and analyzes the samples for chemical content or reaction. May type and cross-match blood samples, research and develop laboratory techniques, teach, or perform administrative duties."
      }
    ]
  },
  "metallurgical engineer": {
    "displayName": "Metallurgical Engineer",
    "items": [
      {
        "name": "Metallurgical Engineer",
        "code": "NLM",
        "description": "Designs rolling mills, heat-treatment facilities, and metalworking plants. Uses knowledge of metals for the selection, melting, and control of alloys used in casting. Is familiar with the various grades of metals and how sound alloys can be produced. Understands metal properties such as strength and hardness, and uses this information to evaluate metal results and to recommend procedures of melting, alloying, and pouring of molten metal to achieve desired properties."
      }
    ]
  },
  "microbiologist": {
    "displayName": "Microbiologist",
    "items": [
      {
        "name": "Microbiologist",
        "code": "CL-L",
        "description": "Studies the growth, structure, development, and other characteristics of microscopic organisms such as bacteria, algae, or fungi. Includes medical microbiologists who study the relationship between organisms and disease or the effects of antibiotics on microorganisms."
      }
    ]
  },
  "mining engineer": {
    "displayName": "Mining Engineer",
    "items": [
      {
        "name": "Mining Engineer",
        "code": "NLM",
        "description": "Determines the location and plans effective and economical extraction of coal, metallic ores, non-metallic minerals, and building materials such as stone or gravel. Conducts or collaborates in geological exploration to determine location, size, accessibility, and estimated value of deposit."
      }
    ]
  },
  "museum ceramic restorer": {
    "displayName": "Museum Ceramic Restorer",
    "items": [
      {
        "name": "Museum Ceramic Restorer",
        "code": "M",
        "description": "Cleans, preserves, restores, and repairs objects made of glass, porcelain, china, fired clay, and other ceramic materials."
      }
    ]
  },
  "naval architect": {
    "displayName": "Naval Architect",
    "items": [
      {
        "name": "Naval Architect",
        "code": "NLM",
        "description": "Designs and oversees construction and repair of marine craft and floating structures. Studies design proposals and specifications to establish basic characteristics of crafts, such as size, weight, speed, propulsion, armament, cargo, displacement, draft, crew and passenger complements, and fresh or saltwater service."
      }
    ]
  },
  "neurologist": {
    "displayName": "Neurologist",
    "items": [
      {
        "name": "Neurologist",
        "code": "IL",
        "description": "Diagnoses and treats organic diseases and disorders of nervous system. Studies results of chemical, microscopic, biological, and bacteriological analyses of patient’s blood and cerebrospinal fluid to determine nature and extent of disease or disorder. Studies results of electroencephalograms or X-rays to detect abnormalities in brain-wave patterns."
      }
    ]
  },
  "neurosurgeon": {
    "displayName": "Neurosurgeon",
    "items": [
      {
        "name": "Neurosurgeon",
        "code": "LM-ILM",
        "description": "Performs surgery on nervous system to correct deformities, repair injuries, prevent diseases, and improve patients’ function."
      }
    ]
  },
  "newspaper columnist": {
    "displayName": "Newspaper Columnist",
    "items": [
      {
        "name": "Newspaper Columnist",
        "code": "CL",
        "description": "Analyzes news and writes column or commentary. Gathers information and analyzes and interprets it to formulate and outline story idea. Selects material most pertinent to presentation and organizes it into acceptable media form and format."
      }
    ]
  },
  "newspaper editor": {
    "displayName": "Newspaper Editor",
    "items": [
      {
        "name": "Newspaper Editor",
        "code": "LE",
        "description": "Formulates editorial policy and directs operation of the newspaper. Confers with editorial policy committee and heads of production, advertising, and circulation departments to develop editorial and operating procedures and negotiate decisions affecting publication. Writes lead editorials or notifies editorial-department head of position to be taken on specific issues."
      }
    ]
  },
  "news photographer": {
    "displayName": "News Photographer",
    "items": [
      {
        "name": "News Photographer",
        "code": "CM-M",
        "description": "Photographs newsworthy events, locations, people, or other illustrative or educational material for use in publications or telecasts. Submits negatives and pictures to editorial personnel. Often specializes in one phase of photography such as news, sports, or special features, or as freelance photographer."
      }
    ]
  },
  "news reporter": {
    "displayName": "News Reporter",
    "items": [
      {
        "name": "News Reporter",
        "code": "CIL",
        "description": "Collects and analyzes information about newsworthy events to write news stories. Gathers and verifies factual information regarding story through interview, observation, and research. Organizes materials, determines slant or emphasis, and writes story according to prescribed editorial style and format standards."
      }
    ]
  },
  "nurse": {
    "displayName": "Nurse",
    "items": [
      {
        "name": "Nurse",
        "code": "CI-I",
        "description": "Assesses patient’s health problems and needs, develops and implements nursing care plans, and maintains medical records. Administers nursing care to ill, injured, convalescent, or disabled patients. May advise patients on health maintenance and disease prevention or provide case management. Includes advanced practice nurses such as nurse practitioners, clinical nurse specialists, certified nurse midwives, and certified registered nurse anesthetists. Advanced practice nursing is practiced by RNs who have specialized formal, post-basic education and who function in highly autonomous and specialized roles."
      }
    ]
  },
  "nurse aide": {
    "displayName": "Nurse Aide",
    "items": [
      {
        "name": "Nurse Aide",
        "code": "CI-I",
        "description": "Performs a variety of duties to care for sick and injured people. Answers patients’ bell calls, delivers messages, serves meals, and makes beds. Also feeds, bathes, moves and dresses patients. May take temperatures and help patients get around. Some may store or move medical supplies and clean patients’ rooms. May work in hospitals, nursing homes, or patients’ homes. In patients’ homes, may also clean laundry, plan meals, shop for food, and prepare meals."
      }
    ]
  },
  "occupational therapist": {
    "displayName": "Occupational Therapist",
    "items": [
      {
        "name": "Occupational Therapist",
        "code": "ILE-IL-I",
        "description": "Plans and directs educational, vocational, and recreational activities designed to help patients with physical, mental, or emotional problems become self-sufficient. Evaluates the abilities of patients, sets goals for them, and plans therapy programs. Teaches skills and the use of tools to restore clients’ movement, coordination, and confidence. Plans and directs games and other activities and may design devices to aid clients. Some teach or do consulting work."
      }
    ]
  },
  "office clerk": {
    "displayName": "Office Clerk",
    "items": [
      {
        "name": "Office Clerk",
        "code": "C",
        "description": "Performs general duties too varied and diverse to be classified in any specific office clerical occupation. Needs limited knowledge of office management systems and procedures. Clerical duties may be assigned in accordance with the office procedures of individual establishments and may include a combination of answering telephones, bookkeeping, typing or word processing, stenography, office machine operation, and filing."
      }
    ]
  },
  "ophthalmologist": {
    "displayName": "Ophthalmologist",
    "items": [
      {
        "name": "Ophthalmologist",
        "code": "NLM",
        "description": "Diagnoses and treats diseases and injuries of eyes. Examines patient for symptoms indicative of organic or congenital ocular disorders, and determines nature and extent of injury or disorder. Performs various tests to determine vision loss, prescribes and administers medications, and performs surgery if indicated. Directs remedial activities to aid in regaining vision or to utilize remaining sight."
      }
    ]
  },
  "parole officer": {
    "displayName": "Parole Officer",
    "items": [
      {
        "name": "Parole Officer",
        "code": "IL-I",
        "description": "Engages in activities related to release of juvenile or adult offenders from correctional institutions. Establishes relationship with offender and studies offender’s social history prior to and during institutionalization. Helps parolee to secure necessary education or employment and refers parolee to social resources of community that can aid in rehabilitation."
      }
    ]
  },
  "pawnbroker": {
    "displayName": "Pawnbroker",
    "items": [
      {
        "name": "Pawnbroker",
        "code": "E-CE",
        "description": "Estimates pawn or pledges value of such articles as jewelry, cameras, and musical instruments, and lends money to customer. Weighs gold or silver articles or employs acid tests to determine carat content and purity to verify value of articles. Computes interest when pledges are redeemed or extended. Sells unredeemed pledged items."
      }
    ]
  },
  "pediatrician": {
    "displayName": "Pediatrician",
    "items": [
      {
        "name": "Pediatrician",
        "code": "NIL-IL",
        "description": "Plans and carries out medical-care program for children from birth through adolescence. Other fields of interest and responsibilities span such areas as infectious diseases, newborn care, environmental hazards, nutrition, accident prevention, drugs, cardiology, and pediatric pharmacology."
      }
    ]
  },
  "pharmacist": {
    "displayName": "Pharmacist",
    "items": [
      {
        "name": "Pharmacist",
        "code": "NCL-NL",
        "description": "Dispenses drugs and medicine prescribed by doctors, dentists or other health practitioners. Advises people on the use of medicines that can be bought without a doctor’s order. May prepare medicines and test drugs for purity and strength. Some keep records of the drugs patients use and advise doctors on the selection and use of drugs. Many who work in drug stores also buy and sell goods and hire and supervise staff. Some teach, do research, do consulting work, or write and edit technical articles."
      }
    ]
  },
  "photojournalist": {
    "displayName": "Photojournalist",
    "items": [
      {
        "name": "Photojournalist",
        "code": "LM",
        "description": "Photographs newsworthy events, locations, people, or other illustrative or educational material for use in publications or telecast. Usually specializes in one phase of photography such as news, sports, or special features, or as freelance photographer."
      }
    ]
  },
  "physical therapist": {
    "displayName": "Physical Therapist",
    "items": [
      {
        "name": "Physical Therapist",
        "code": "CIM-ILM",
        "description": "Plans and administers medically prescribed physical-therapy treatment programs for patients to restore function, relieve pain, and prevent disability following disease, injury, or loss of body part. Works at hospital, rehabilitation center, nursing home, or home health agency, or in private practice. Reviews and evaluates physician’s referral and patient’s medical records to determine physical-therapy treatment required. Instructs patient in physical-therapy procedures to be continued at home."
      }
    ]
  },
  "physician": {
    "displayName": "Physician",
    "items": [
      {
        "name": "Physician",
        "code": "NIL-IL",
        "description": "Diagnoses, treats, and helps prevent diseases and injuries that commonly occur in the general population."
      }
    ]
  },
  "plastic surgeon": {
    "displayName": "Plastic Surgeon",
    "items": [
      {
        "name": "Plastic Surgeon",
        "code": "NLM",
        "description": "Specializes in skin grafts and bone transplants to restore or repair damaged, lost, or deformed parts of the face and body."
      }
    ]
  },
  "police inspector": {
    "displayName": "Police Inspector",
    "items": [
      {
        "name": "Police Inspector",
        "code": "CI",
        "description": "Inspects police stations and examines personnel and case records to ensure that police personnel conform to prescribed standards of appearances, conduct, and efficiency. Prepares reports concerning discipline, efficiency, and condition of force within division. May serve as police liaison on civil boards engaged in improving community living."
      }
    ]
  },
  "police officer": {
    "displayName": "Police Officer",
    "items": [
      {
        "name": "Police Officer",
        "code": "IL",
        "description": "Patrols assigned beat on foot, using motorcycle or patrol car, to control traffic, prevent crime or disturbance of peace, and arrest violators. Reports hazards, renders first aid at accidents and investigates causes and results of accident, inspects public establishments requiring licenses to ensure compliance with rules and regulations, warns or arrests persons violating animal ordinances, and issues tickets to traffic violators."
      }
    ]
  },
  "postal clerk": {
    "displayName": "Postal Clerk",
    "items": [
      {
        "name": "Postal Clerk",
        "code": "C",
        "description": "Performs any combination of tasks in a local post office or postal processing center. Duties may include receiving letters and parcels, selling postage and revenue stamps, postal cards, and stamped envelopes. May fill out and sell money orders, place mail in pigeon holes of mail rack or in mail bags, and examine mail for correct postage."
      }
    ]
  },
  "postmaster": {
    "displayName": "Postmaster",
    "items": [
      {
        "name": "Postmaster",
        "code": "CE",
        "description": "Organizes and supervises workers engaged in postal activities such as processing incoming and outgoing mail, issuing and cashing money orders, selling stamps, bonds, and certificates; and collecting box rents to ensure efficient service to customers. Confers with suppliers to obtain bids for proposed purchases, requisitions supplies, and disburses funds as specified by law."
      }
    ]
  },
  "production planning supervisor": {
    "displayName": "Production-Planning Supervisor",
    "items": [
      {
        "name": "Production-Planning Supervisor",
        "code": "NCL-NC",
        "description": "Plans and prepares production schedules for manufacture of industrial or commercial products. Analyzes production specifications and plant-capacity data and performs mathematical calculations to determine manufacturing processes, tools, and manpower requirements. Plans sequence of fabrication, assembly, installation, and other manufacturing operations."
      }
    ]
  },
  "project engineer": {
    "displayName": "Project Engineer",
    "items": [
      {
        "name": "Project Engineer",
        "code": "NEM",
        "description": "Directs, plans, and formulates engineering program and organizes project staff. Assigns project personnel to specified phases or aspect of project such as technical studies, product design, preparation of specifications and technical plans, and product testing. Evaluates and approves design changes, specifications, and drawing releases."
      }
    ]
  },
  "proofreader": {
    "displayName": "Proofreader",
    "items": [
      {
        "name": "Proofreader",
        "code": "C-NC",
        "description": "Reads typescript (original copy) or proof of type setup to detect and mark for correction any grammatical, typographical, or compositional errors. May measure dimensions, spacing, and positioning of page elements (copy and illustrations) to verify conformance to specification."
      }
    ]
  },
  "psychiatrist": {
    "displayName": "Psychiatrist",
    "items": [
      {
        "name": "Psychiatrist",
        "code": "NIL-IL",
        "description": "Studies, diagnoses, and treats mental, emotional, and behavioral disorders. Organizes data concerning patient’s family, personal (medical and mental) history, and onset of symptoms obtained from patient, relatives, and other sources. Orders laboratory and other special diagnostic tests and evaluates data obtained. Treats or directs treatment of patient utilizing a variety of psychotherapeutic methods and medications."
      }
    ]
  },
  "public relations representative": {
    "displayName": "Public Relations Representative",
    "items": [
      {
        "name": "Public Relations Representative",
        "code": "E",
        "description": "Plans, directs, and conducts public relations program designed to create and maintain a public informed of employer’s programs, accomplishments, or point of view. Prepares and distributes fact sheets, news releases, photographs, scripts, motion pictures, or tape recordings to media representatives. May specialize in researching data, creating ideas, writing copy, laying out artwork, contacting media representatives or representing client before general public."
      }
    ]
  },
  "purchasing manager": {
    "displayName": "Purchasing Manager",
    "items": [
      {
        "name": "Purchasing Manager",
        "code": "NLE",
        "description": "Directs and coordinates activities of personnel engaged in purchasing and distributing raw materials, equipment, machinery, and supplies. Analyzes market and delivery conditions to determine present and future material availability."
      }
    ]
  },
  "quality control engineer": {
    "displayName": "Quality Control Engineer",
    "items": [
      {
        "name": "Quality Control Engineer",
        "code": "NL",
        "description": "Plans and directs activities concerned with development, application, and maintenance of quality standards for processing materials into partially finished material or product. Develops and initiates methods and procedures for inspections, testing, and evaluation."
      }
    ]
  },
  "real estate agent": {
    "displayName": "Real Estate Agent",
    "items": [
      {
        "name": "Real Estate Agent",
        "code": "E-NCE",
        "description": "Generally an independent sales worker who contracts services with licensed broker. Shows and sells real estate, handles rental properties, and obtains “listings” (owner agreements to place properties for sale with the firm). Represents property owners in selling or renting their properties."
      }
    ]
  },
  "reception clerk": {
    "displayName": "Reception Clerk",
    "items": [
      {
        "name": "Reception Clerk",
        "code": "CIE",
        "description": "Interviews applicants for employment and processes application forms. Refers qualified applicants to employing official. May inform applicant of acceptance or rejection for employment. May compile personnel records."
      }
    ]
  },
  "receptionist": {
    "displayName": "Receptionist",
    "items": [
      {
        "name": "Receptionist",
        "code": "C-CI",
        "description": "Receives calls at establishment, determines nature of problems or business, and directs them to their destinations."
      }
    ]
  },
  "sales manager": {
    "displayName": "Sales Manager",
    "items": [
      {
        "name": "Sales Manager",
        "code": "E",
        "description": "Directs the actual distribution or movement of a product or service to the customer. Coordinates sales distribution by establishing sales territories, quotas, and goals and establishes training programs for sales representatives. Analyzes sales statistics gathered by staff to determine sales potential and inventory requirements and monitor the preferences of customers."
      }
    ]
  },
  "secondary school teacher": {
    "displayName": "Secondary-School Teacher",
    "items": [
      {
        "name": "Secondary-School Teacher",
        "code": "CIE-IE-I",
        "description": "Teaches one or more subjects to students in secondary schools using various teaching methods. Prepares teaching outline for course of study, assigns lessons, and corrects homework papers. Administers tests to evaluate pupils’ progress."
      }
    ]
  },
  "secretary": {
    "displayName": "Secretary",
    "items": [
      {
        "name": "Secretary",
        "code": "CE-C",
        "description": "Performs routine clerical and administrative functions such as drafting correspondence, scheduling appointments, organizing and maintaining paper and electronic files, or providing information to callers."
      }
    ]
  },
  "seismologist": {
    "displayName": "Seismologist",
    "items": [
      {
        "name": "Seismologist",
        "code": "NLM",
        "description": "Determines the place and time that earthquakes occur each year. For earthquakes, instrumentally recorded work is done in analysis centers, built around large computers housed in university or government laboratories."
      }
    ]
  },
  "sociologist": {
    "displayName": "Sociologist",
    "items": [
      {
        "name": "Sociologist",
        "code": "IL",
        "description": "Studies the behavior and interaction of groups, traces their origin and growth, and analyzes the influence of group activities on individual members. These groups include families, tribes, communities, and governments, along with a variety of social, religious, political, business, and other organizations. May be involved in research, writing, or administration at a university, and may supervise or consult with the operation of social-service agencies."
      }
    ]
  },
  "statistician": {
    "displayName": "Statistician",
    "items": [
      {
        "name": "Statistician",
        "code": "N",
        "description": "Conducts research into mathematical theories and proofs that form basis of science of statistics and develops statistical methodology. Examines theories such as probability and interference to discover mathematical bases for new or improved methods of obtaining and evaluating numerical data."
      }
    ]
  },
  "stockbroker": {
    "displayName": "Stockbroker",
    "items": [
      {
        "name": "Stockbroker",
        "code": "E-NE",
        "description": "Buys and sells stocks and bonds for individuals and organizations as representative of stock-brokerage firm, applying knowledge of securities, market conditions, government regulations, and financial circumstances of customers. Transmits buy or sell orders to trading division in accordance with customer’s wishes. Develops portfolio of selected investments for customers."
      }
    ]
  },
  "surgeon": {
    "displayName": "Surgeon",
    "items": [
      {
        "name": "Surgeon",
        "code": "ILM",
        "description": "Performs surgery to correct deformities, repair injuries, prevent diseases, and improve function in patients. Examines patient to verify necessity of operation, estimates possible risk to patient, and determines best operational procedure."
      }
    ]
  },
  "systems analyst": {
    "displayName": "Systems Analyst",
    "items": [
      {
        "name": "Systems Analyst",
        "code": "NL",
        "description": "Analyzes business procedures and problems to refine data and convert them to programmable form for electronic data-processing. Specifies in detail logical and/or mathematical operations to be performed by various equipment units and/or comprehensive computer programs and operations to be performed by systems personnel."
      }
    ]
  },
  "tax attorney": {
    "displayName": "Tax Attorney",
    "items": [
      {
        "name": "Tax Attorney",
        "code": "NLE-NIE-NCI-NI",
        "description": "Advises individuals, businesses, and other organizations concerning income, estate, excise, property and other state, local, and foreign taxes. Prepares opinions on tax liability resulting from prospective and past transactions. Represents clients in tax litigations."
      }
    ]
  },
  "teacher aide": {
    "displayName": "Teacher Aide",
    "items": [
      {
        "name": "Teacher Aide",
        "code": "CI",
        "description": "Performs duties that are instructional in nature or delivers direct services to students or parents. Serves in a position for which a teacher or another professional has ultimate responsibility for the educational programs and services."
      }
    ]
  },
  "television director": {
    "displayName": "Television Director",
    "items": [
      {
        "name": "Television Director",
        "code": "EM-IEM",
        "description": "Interprets scripts, conducts rehearsals, and directs and integrates all audio and video elements of television program. Informs technician of scenery, lights, props, and other equipment desired. Approves scenery, costumes, choreography, and music."
      }
    ]
  },
  "travel agent": {
    "displayName": "Travel Agent",
    "items": [
      {
        "name": "Travel Agent",
        "code": "CE",
        "description": "Plans trips for travel agency customers. Duties include determining destination, modes of transportation, travel dates, costs, accommodations required, and planning, describing, or selling itinerary package tours. May specialize in foreign or domestic service, individual or group travel, specific geographical area, airplane charters, or package tours."
      }
    ]
  },
  "veterinarian": {
    "displayName": "Veterinarian",
    "items": [
      {
        "name": "Veterinarian",
        "code": "L-IL",
        "description": "Diagnoses and treats injuries, diseases and dysfunctions of animals. Advises owners on providing health care and preventing disease. May engage in a related function such as research and development, consultation, administration, technical writing, sale or production of commercial products, or rendering of technical services to commercial firms or other organizations. Includes veterinarians who inspect livestock."
      }
    ]
  },
  "video operator": {
    "displayName": "Video Operator",
    "items": [
      {
        "name": "Video Operator",
        "code": "NM",
        "description": "Controls video console to regulate transmission of television scenes. Previews program to be used next to determine that signal is functioning and that program will be ready at required time."
      }
    ]
  },
  "warehouse manager": {
    "displayName": "Warehouse Manager",
    "items": [
      {
        "name": "Warehouse Manager",
        "code": "CE",
        "description": "Directs warehousing activities for commercial or industrial establishment. Establishes operational procedures for incoming and outgoing shipments, handling and disposition of materials, and keeping warehouse inventory current."
      }
    ]
  },
  "wedding consultant": {
    "displayName": "Wedding Consultant",
    "items": [
      {
        "name": "Wedding Consultant",
        "code": "IE",
        "description": "Advises prospective brides in all phases of wedding planning such as etiquette, attire of wedding party, and selection of trousseau. May compile and maintain gift register, attend rehearsals and wedding ceremony to give advice on etiquette, and accompany bride when shopping in store."
      }
    ]
  },
  "wholesaler": {
    "displayName": "Wholesaler",
    "items": [
      {
        "name": "Wholesaler",
        "code": "E",
        "description": "Manages establishment engaged in purchasing, wholesaling, and distributing merchandise and supplies to retailers, industrial and commercial consumers, or professional personnel."
      }
    ]
  },
  "zoologist": {
    "displayName": "Zoologist",
    "items": [
      {
        "name": "Zoologist",
        "code": "L-NL",
        "description": "Studies origin, interrelationships, classification, life histories, habits, life processes, diseases, relation to environment, growth and development, genetics, and distribution of animals. Studies animals in natural habitat and collects specimens for laboratory study."
      }
    ]
  }
};

  const CAREER_TRACK_STRAND_BY_KEY = {
    "accountant": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "accounting aide": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "accounting clerk": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "aeronautical engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "agricultural engineer": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Agricultural-Fishery Arts (AFA)" },
    ],
    "agricultural engineering": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Agricultural-Fishery Arts (AFA)" },
    ],
    "agricultural microbiologist": [
      { track: "Academic Track", strand: "HUMSS" },
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Agricultural-Fishery Arts (AFA)" },
    ],
    "agronomist": [
      { track: "Academic Track", strand: "HUMSS" },
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Agricultural-Fishery Arts (AFA)" },
    ],
    "air conditioning mechanic": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
    ],
    "air conditioning technician": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
    ],
    "aircraft inspector": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
    ],
    "airlin0lounge receptionist": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "airline dispatcher": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "airline lounge receptionist": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "airline pilot": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
    ],
    "airplane inspector": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
    ],
    "anesthesiologist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "animator": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "apartment condominium superintendent": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "apartment condominium supt": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "appraiser": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "arcade attendant": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "architect": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "architectural graphic designer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "art director": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "art teacher": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "artificial eye maker": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "astronomer": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "athletic trainer": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "audio technician": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Information and Communications Technology (ICT)" },
    ],
    "audiovisual technician": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Information and Communications Technology (ICT)" },
    ],
    "auditor": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "automobile mechanic": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
    ],
    "bacteriologist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "bank cashier": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "bank credit analyst": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "bank lending officer": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "bank manager": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "bank teller": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "biochemist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "biologist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "biology teacher": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "blood bank technologist": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "book designer": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "book editor": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "book jacket designer": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "bookkeeper": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "botanist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "branch bank operations officer": [
      { track: "Academic Track", strand: "ABM" },
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "broadcasting announcer": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "broadcasting director": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Information and Communications Technology (ICT)" },
    ],
    "broadcasting tv director": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Information and Communications Technology (ICT)" },
    ],
    "building contractor": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
    ],
    "building inspector": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "business agent": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "business analyst": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "business consultant": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "cabinetmaker": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "cartoonist": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "caterer": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "certified public accountant": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "chef": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Home Economics (HE)" },
    ],
    "chemical engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "chemist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "chief petroleum engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "child psychologist": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "civil engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "clothes designer": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "commercial photographer": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Information and Communications Technology (ICT)" },
    ],
    "computer applications engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "computer programmer": [
      { track: "Academic Track", strand: "STEM" },
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Information and Communications Technology (ICT)" },
    ],
    "computer system analyst": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "construction electrician": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
    ],
    "construction inspector": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "costume designer": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "counseling psychologist": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "criminologist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "customs inspector": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "database manager": [
      { track: "Academic Track", strand: "STEM" },
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Information and Communications Technology (ICT)" },
    ],
    "dermatologist": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "design engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "diagnostic x ray technologist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "diet counselor": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "dietitian": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "directory assistance operator": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "drafter draftsman": [
      { track: "Academic Track", strand: "STEM" },
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "economist": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "electrical engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "electrician": [
      { track: "Academic Track", strand: "STEM" },
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
    ],
    "electronics engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "electronics technician": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Information and Communications Technology (ICT)" },
    ],
    "electroplater": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
    ],
    "elementary school teacher": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "executive secretary": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "fashion coordinator": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Home Economics (HE)" },
    ],
    "fashion designer": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Home Economics (HE)" },
    ],
    "file clerk": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "film director": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "financial analyst": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "financial planner": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "fire inspector": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "food and beverage manager": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "foreign correspondent": [
      { track: "Academic Track", strand: "ABM" },
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "geologist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "goldsmith": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "graphic designer": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "guidance counselor": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "gynecologist": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "head nurse": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "high school principal": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "historian": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "hospital administrator": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "hotel bell captain": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "hotel manager": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "immigration lawyer": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "industrial engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "information clerk": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "insurance agent": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "interior designer": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "internal revenue agent": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "international banker": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "jeweler": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "judge": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "kindergarten teacher": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "land surveyor": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
    ],
    "lawyer": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "legal assistant": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "librarian": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "loan officer": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "marine biologist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "mathematics teacher": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "mechanical engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "metallurgical engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "microbiologist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "mining engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "museum ceramic restorer": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "naval architect": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "neurologist": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "news photographer": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "news reporter": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "newspaper columnist": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "newspaper editor": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "occupational therapist": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "nurse": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "nurse aide": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "office clerk": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "ophthalmologist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "parole officer": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "pawnbroker": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "pediatrician": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "pharmacist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "photojournalist": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
    ],
    "physician": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "plastic surgeon": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "police inspector": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "police officer": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "postal clerk": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "postmaster": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "production planning supervisor": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "proofreader": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "psychiatrist": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "public relations representative": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "purchasing manager": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "quality control engineer": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "reception clerk": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "receptionist": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "sales manager": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "secondary school teacher": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "secretary": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "seismologist": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "sociologist": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "stockbroker": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "systems analyst": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "tax attorney": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "teacher aide": [
      { track: "Academic Track", strand: "HUMSS" },
    ],
    "television director": [
      { track: "Arts and Design Track", strand: "Arts and Design" },
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Information and Communications Technology (ICT)" },
    ],
    "travel agent": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "veterinarian": [
      { track: "Academic Track", strand: "STEM" },
    ],
    "video operator": [
      { track: "Technical Vocational-Livelihood (TVL) Track", strand: "Industrial Arts (IA)" },
    ],
    "warehouse manager": [
      { track: "Academic Track", strand: "GAS" },
    ],
    "wholesaler": [
      { track: "Academic Track", strand: "ABM" },
    ],
    "zoologist": [
      { track: "Academic Track", strand: "STEM" },
    ],
  };

  function getCareerTrackStrandList(careerName) {
    const key = normalizeCareerKey(careerName);
    return CAREER_TRACK_STRAND_BY_KEY[key] || [];
  }

  function getCareerTrackStrand(careerName) {
    const placements = getCareerTrackStrandList(careerName);
    return placements.length ? placements[0] : null;
  }

  function formatCareerTrackStrand(careerName) {
    const placements = getCareerTrackStrandList(careerName);
    if (!placements.length) return "";
    return placements.map(item => `${item.track} — ${item.strand}`).join(" | ");
  }

  function getCareerDetails(careerName) {
    const key = normalizeCareerKey(careerName);
    return CAREER_DETAILS_BY_KEY[key] || null;
  }

  const CAREER_EXTRA_DETAILS_BY_KEY = {
    "tax attorney": {
      title: "Key Information",
      items: [
        "Primary responsibilities: Advises individuals, businesses, and other organizations on income, estate, excise, property, and other state, local, and foreign tax matters.",
        "Work focus: May prepare tax opinions, review liability from past and prospective transactions, and represent clients in tax litigation.",
        "Helpful strengths: Strong reading, writing, legal analysis, research, and attention to detail are especially useful in this career.",
        "Possible related paths: Legal Management, Accountancy, Political Science, Finance, and Law."
      ]
    }
  };

  function sentenceParts(text) {
    return String(text || '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(/(?<=[.!?])\s+/)
      .map(part => part.trim())
      .filter(Boolean);
  }

  function uniqueItems(items) {
    const seen = new Set();
    return (items || []).filter(item => {
      const value = String(item || '').trim();
      if (!value) return false;
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function getCodeLetters(code) {
    return uniqueItems(
      String(code || '')
        .toUpperCase()
        .match(/[NCILEM]/g) || []
    );
  }

  function getInterestPhrases(code) {
    const map = {
      N: 'numbers, data, and measurement',
      C: 'organization, procedures, and record accuracy',
      I: 'helping people, communication, and service',
      L: 'analysis, investigation, and problem-solving',
      E: 'business, leadership, and decision-making',
      M: 'tools, machines, and hands-on systems'
    };

    return getCodeLetters(code).map(letter => map[letter]).filter(Boolean);
  }

  function getStrengthPhrases(code) {
    const map = {
      N: 'quantitative reasoning',
      C: 'attention to detail',
      I: 'communication and empathy',
      L: 'critical thinking and research',
      E: 'initiative and leadership',
      M: 'technical and practical skills'
    };

    return getCodeLetters(code).map(letter => map[letter]).filter(Boolean);
  }

  function joinNatural(items) {
    const values = uniqueItems(items);
    if (!values.length) return '';
    if (values.length === 1) return values[0];
    if (values.length === 2) return `${values[0]} and ${values[1]}`;
    return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`;
  }

  function detectRelatedPaths(careerName, description) {
    const text = `${careerName} ${description}`.toLowerCase();
    const paths = [];

    function addPath(...items) {
      items.forEach(item => {
        if (item && !paths.includes(item)) paths.push(item);
      });
    }

    if (/(teacher|educator|professor|school)/.test(text)) {
      addPath('Education', 'Early Childhood Education', 'Secondary Education');
    }
    if (/(lawyer|attorney|legal|parole|criminologist|customs inspector|internal revenue agent|immigration lawyer)/.test(text)) {
      addPath('Legal Management', 'Political Science', 'Criminology', 'Law');
    }
    if (/(account|audit|bank|finance|financial|tax|credit|budget|cashier)/.test(text)) {
      addPath('Accountancy', 'Finance', 'Business Administration', 'Economics');
    }
    if (/(engineer|architect|construction|industrial|civil|aeronautical|petroleum|city planning)/.test(text)) {
      addPath('Engineering', 'Architecture', 'Mathematics', 'Engineering Technology');
    }
    if (/(nurse|doctor|physician|dent|medical|dietitian|psychologist|therapist|technologist|anesthesiologist|cardiologist|dermatologist|chiropractor|dialysis|veterinarian)/.test(text)) {
      addPath('Health Sciences', 'Biology', 'Psychology', 'Nursing', 'Medical Technology');
    }
    if (/(programmer|computer|database|system analyst|applications engineer|information systems|information technology)/.test(text)) {
      addPath('Computer Science', 'Information Technology', 'Information Systems');
    }
    if (/(designer|artist|photographer|animator|cartoonist|art director|copywriter|fashion|interior|costume)/.test(text)) {
      addPath('Fine Arts', 'Multimedia Arts', 'Graphic Design', 'Communication Arts');
    }
    if (/(manager|consultant|sales|agent|broker|marketing|business)/.test(text)) {
      addPath('Business Administration', 'Marketing Management', 'Entrepreneurship', 'Management');
    }
    if (/(chemist|microbiologist|zoologist|bacteriologist|agronomist|scientist|agricultural)/.test(text)) {
      addPath('Biology', 'Chemistry', 'Agriculture', 'Environmental Science');
    }
    if (/(mechanic|electrician|technician|inspector|pilot|dispatcher|flight attendant|audio technician|audiovisual technician|airline)/.test(text)) {
      addPath('Technical-Vocational Education', 'Engineering Technology', 'Aviation');
    }

    if (!paths.length) {
      addPath('Related college or technical preparation in the same field');
    }

    return paths.slice(0, 4);
  }

  function buildFitSentence(careerName, description, code) {
    const interestText = joinNatural(getInterestPhrases(code));
    const text = `${careerName} ${description}`.toLowerCase();

    if (interestText) {
      return `Career fit: Often suits learners interested in ${interestText}.`;
    }

    if (/(teacher|educator|school)/.test(text)) {
      return 'Career fit: Often suits learners who enjoy teaching, guiding, and working closely with students.';
    }
    if (/(lawyer|attorney|legal|criminologist|parole)/.test(text)) {
      return 'Career fit: Often suits learners interested in law, public service, analysis, and advocacy.';
    }
    if (/(engineer|architect|mechanic|technician)/.test(text)) {
      return 'Career fit: Often suits learners who enjoy solving practical problems and working with systems, tools, or structures.';
    }
    if (/(nurse|doctor|therapist|psychologist|dietitian|dent|medical|physician)/.test(text)) {
      return 'Career fit: Often suits learners interested in health, service, and helping people improve their well-being.';
    }
    if (/(account|finance|bank|audit|credit)/.test(text)) {
      return 'Career fit: Often suits learners who like business, finance, record accuracy, and data-based decisions.';
    }
    if (/(artist|designer|photographer|animator|cartoonist)/.test(text)) {
      return 'Career fit: Often suits learners who enjoy creativity, design, and visual expression.';
    }

    return 'Career fit: Often suits learners whose interests and strengths match the responsibilities of this field.';
  }

  function buildStrengthSentence(code) {
    const strengthsText = joinNatural(getStrengthPhrases(code));
    if (strengthsText) {
      return `Helpful strengths: ${strengthsText} can be especially useful in this career.`;
    }
    return 'Helpful strengths: communication, discipline, adaptability, and willingness to learn are useful in this career.';
  }

  function buildPathsSentence(careerName, description) {
    const paths = detectRelatedPaths(careerName, description);
    if (!paths.length) {
      return 'Possible related paths: Related college or technical preparation in the same field.';
    }
    return `Possible related paths: ${joinNatural(paths)}.`;
  }

  function buildTrackStrandSentence(careerName) {
    const placementText = formatCareerTrackStrand(careerName);
    return placementText ? `Track/Strand: ${placementText}.` : '';
  }

  function buildFallbackCareerExtras(careerName, groupCode, detail) {
    const firstItem =
      Array.isArray(detail?.items) && detail.items.length
        ? detail.items[0]
        : null;

    const description = String(firstItem?.description || '').trim();
    const code = String(firstItem?.code || '').trim();
    const parts = sentenceParts(description);

    const primary = parts[0]
      ? `Primary responsibilities: ${parts[0]}`
      : `Primary responsibilities: ${careerName} work usually depends on the responsibilities of the role and the field where it is practiced.`;

    const workFocus = parts[1]
      ? `Work focus: ${parts[1]}`
      : buildFitSentence(careerName, description, code);

    const items = uniqueItems([
      buildTrackStrandSentence(careerName),
      primary,
      workFocus,
      buildStrengthSentence(code),
      buildPathsSentence(careerName, description)
    ]);

    return {
      title: 'Key Information',
      items: items.slice(0, 4)
    };
  }

  function getCareerExtraDetails(careerName, groupCode = '', providedDetail = null) {
    const key = normalizeCareerKey(careerName);
    const detail = providedDetail || getCareerDetails(careerName);

    const manual = CAREER_EXTRA_DETAILS_BY_KEY[key];
    if (manual) {
      const manualItems = Array.isArray(manual.items)
        ? manual.items.map(item => String(item || '').trim()).filter(Boolean)
        : [];
      const trackStrand = buildTrackStrandSentence(careerName);

      return {
        title: String(manual.title || 'Key Information').trim() || 'Key Information',
        items: [trackStrand, ...manualItems].filter(Boolean)
      };
    }

    return buildFallbackCareerExtras(careerName, groupCode, detail);
  }

  window.normalizeCareerKey = normalizeCareerKey;
  window.CAREER_DETAILS_BY_KEY = CAREER_DETAILS_BY_KEY;
  window.CAREER_EXTRA_DETAILS_BY_KEY = CAREER_EXTRA_DETAILS_BY_KEY;
  window.CAREER_TRACK_STRAND_BY_KEY = CAREER_TRACK_STRAND_BY_KEY;
  window.getCareerTrackStrandList = getCareerTrackStrandList;
  window.getCareerTrackStrand = getCareerTrackStrand;
  window.formatCareerTrackStrand = formatCareerTrackStrand;
  window.getCareerDetails = getCareerDetails;
  window.getCareerExtraDetails = getCareerExtraDetails;
})();
