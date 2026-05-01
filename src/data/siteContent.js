export const features = [
  {
    title: "Inventory control",
    text: "Track parts, low-stock alerts, vendors, and purchase flows with a clean admin-first layout."
  },
  {
    title: "Sales and invoices",
    text: "Staff can create sales invoices, email them, and see customer purchase history in one place."
  },
  {
    title: "Customer self-service",
    text: "Customers can register, request parts, book appointments, and review service history."
  },
  {
    title: "AI prediction",
    text: "A dedicated customer panel highlights predictive maintenance and upcoming part failure signals."
  },
  {
    title: "Reports and insight",
    text: "Admin and staff dashboards surface financial, inventory, and customer reports visually."
  },
  {
    title: "Authentication flow",
    text: "Landing page, sign in, and sign up routes are ready for backend integration later."
  }
];

export const roleCards = {
  admin: {
    badge: "Admin workspace",
    title: "Operations, stock, and business insight",
    description: "The admin view focuses on inventory, financial performance, staff access, and alerts so leaders can make fast decisions.",
    items: [
      "Manage parts, vendors, and inventory thresholds",
      "Review financial and inventory reports",
      "Register staff and assign roles",
      "Track low-stock notifications and outstanding issues"
    ]
  },
  staff: {
    badge: "Staff workspace",
    title: "Customer handling and transaction flow",
    description: "The staff view is tuned for daily service work: customer registration, sales, invoices, searches, and customer history.",
    items: [
      "Register customers with vehicle details",
      "Search by name, phone, ID, or vehicle number",
      "Create sales and email invoices",
      "View customer histories and reports"
    ]
  },
  customer: {
    badge: "Customer workspace",
    title: "Self-service and vehicle support",
    description: "The customer view groups registration, purchase history, service history, requests, appointments, and AI prediction tools.",
    items: [
      "Self-register and manage profile data",
      "Request parts and book service appointments",
      "Track purchase and service history",
      "Review AI-driven maintenance predictions"
    ]
  }
};

export const dashboardData = {
  admin: {
    title: "Admin dashboard",
    subtitle: "Inventory, finance, staff, and alerts in one operational command center.",
    kpis: [
      { label: "Active parts", value: "1,248", delta: "+9 this week" },
      { label: "Low stock items", value: "14", delta: "6 need immediate reorder" },
      { label: "Monthly revenue", value: "NPR 2.8M", delta: "+12.4% vs last month" },
      { label: "Registered staff", value: "18", delta: "3 new this term" }
    ],
    leftTitle: "Operational snapshots",
    leftBody: "This layout mirrors the coursework brief by highlighting reports, stock pressure, and management tasks that belong to the admin role.",
    rows: [
      ["Brake pads", "12", "Top seller", "good"],
      ["Air filters", "8", "Reorder soon", "warn"],
      ["Battery packs", "4", "Critical level", "danger"],
      ["Engine oil", "26", "Healthy", "good"]
    ],
    rightTitle: "Core tasks",
    rightBody: "These are the main actions requested in the brief and represented in the prototype UI.",
    tasks: [
      "Generate financial and inventory reports",
      "Manage parts, vendors, and purchase logs",
      "Assign staff roles and access",
      "Monitor low-stock notifications"
    ],
    chart: [
      ["Inventory turnover", 82],
      ["Monthly sales", 68],
      ["Revenue recovery", 74],
      ["Open issues", 31]
    ]
  },
  staff: {
    title: "Staff dashboard",
    subtitle: "Fast search, customer registration, invoice creation, and service support.",
    kpis: [
      { label: "Customers served", value: "42", delta: "11 today" },
      { label: "Invoices sent", value: "19", delta: "8 emailed" },
      { label: "Vehicle records", value: "63", delta: "4 updated" },
      { label: "Pending follow-ups", value: "7", delta: "2 overdue" }
    ],
    leftTitle: "Search and register",
    leftBody: "Staff need a focused workspace, so the UI places customer lookup and registration where they are easy to reach.",
    rows: [
      ["Mina Shrestha", "9841-555-122", "Hatchback", "good"],
      ["Sujan Rai", "9801-873-944", "SUV", "good"],
      ["Prakash Gurung", "9812-441-630", "Pickup", "warn"],
      ["Anita Thapa", "9800-112-778", "Sedan", "good"]
    ],
    rightTitle: "Daily service tasks",
    rightBody: "The brief calls for invoice creation, customer histories, and report generation, which this panel keeps visible.",
    tasks: [
      "Register new customers with vehicle details",
      "Create and email sales or service invoices",
      "Search customers by multiple identifiers",
      "Review history, reports, and reminders"
    ],
    chart: [
      ["Walk-in registrations", 74],
      ["Invoice completion", 87],
      ["Search response speed", 92],
      ["Follow-up backlog", 28]
    ]
  },
  customer: {
    title: "Customer dashboard",
    subtitle: "A self-service area for profile, purchases, service history, and requests.",
    kpis: [
      { label: "Open requests", value: "3", delta: "1 awaiting review" },
      { label: "Service visits", value: "6", delta: "2 this year" },
      { label: "Items purchased", value: "18", delta: "4 in the last month" },
      { label: "AI alerts", value: "2", delta: "Predictive reminders active" }
    ],
    leftTitle: "Recent activity",
    leftBody: "The customer role is centered around self-service, vehicle management, and transparent service history.",
    rows: [
      ["Oil filter", "Purchased", "10 Apr", "good"],
      ["Appointment", "Booked", "18 Apr", "good"],
      ["Brake check", "Completed", "07 Apr", "good"],
      ["Battery alert", "Suggested", "Today", "warn"]
    ],
    rightTitle: "Customer tools",
    rightBody: "The coursework mentions AI prediction, part requests, bookings, and service review. These are grouped into one dashboard view.",
    tasks: [
      "Self-register and manage profile information",
      "Request parts or book service appointments",
      "View purchase and service history",
      "Review vehicle insights and AI predictions"
    ],
    chart: [
      ["Profile completeness", 94],
      ["Purchase history", 72],
      ["Booking readiness", 86],
      ["AI confidence", 63]
    ]
  }
};

export const staffPages = {
  "staff-dashboard": {
    title: "Staff dashboard",
    subtitle: "Customer handling and invoice operations",
    badge: "Staff dashboard",
    hero: "This workspace keeps the staff flow focused on registrations, searches, customer records, and billing so the daily work stays quick.",
    highlight: "Today’s focus",
    highlightText: "Search, register, bill, and follow up without leaving the staff area.",
    kpis: [
      ["Customers served", "42", "11 handled today"],
      ["Invoices sent", "19", "8 emailed already"],
      ["Vehicle records", "63", "4 updated this hour"],
      ["Follow-ups", "7", "2 overdue reminders"]
    ],
    blocks: [
      {
        title: "Active queue",
        body: "These are the most recent customer tasks waiting on staff attention.",
        items: [
          ["Minu Shrestha", "Registration completed", "Done", "good"],
          ["Prakash Gurung", "Invoice draft ready", "Review", "warn"],
          ["Anita Thapa", "Vehicle lookup pending", "Urgent", "danger"]
        ]
      },
      {
        title: "Quick actions",
        body: "Start the most common staff flows from one place.",
        links: [
          ["Register a new customer", "customer-registration"],
          ["Find a customer record", "customer-search"],
          ["Prepare a sales invoice", "sales-invoice"],
          ["Send invoice by email", "email-invoice"]
        ]
      },
      {
        title: "Search shortcuts",
        body: "Staff usually search by name, phone, vehicle number, or invoice reference.",
        badges: ["Phone lookup", "Vehicle number", "Invoice ID", "Service status"]
      },
      {
        title: "Support snapshot",
        body: "Customer history and reports are available once a record is selected.",
        items: [
          ["Customer history", "Service and purchase timeline", "Ready", "good"],
          ["Customer reports", "Simple overview and insights", "Ready", "good"]
        ]
      }
    ]
  },
  "customer-registration": {
    title: "Customer Registration",
    subtitle: "New profile intake",
    badge: "Registration workflow",
    hero: "Capture customer, contact, and vehicle details in one clean screen.",
    highlight: "Intake ready",
    highlightText: "Move straight to search, details, or invoice creation after saving.",
    form: true,
    checklist: [
      "Customer contact details verified",
      "Vehicle number and type entered",
      "Service note or special request recorded",
      "Record ready for search and invoicing"
    ]
  },
  "customer-search": {
    title: "Customer Search",
    subtitle: "Fast lookup",
    badge: "Lookup center",
    hero: "Find the right customer record fast.",
    highlight: "Search ready",
    highlightText: "Search by customer name, phone, vehicle number, or service reference.",
    search: true
  },
  "customer-details": {
    title: "Customer Details",
    subtitle: "Profile view",
    badge: "Profile view",
    hero: "Customer details and staff notes.",
    highlight: "Ready for handoff",
    highlightText: "Move from profile review to vehicle detail or billing immediately.",
    profile: true
  },
  "vehicle-details": {
    title: "Vehicle Details",
    subtitle: "Service context",
    badge: "Fleet record",
    hero: "Vehicle profile and maintenance state.",
    highlight: "Service due soon",
    highlightText: "Keep the next service reminder visible to the staff member.",
    vehicle: true
  },
  "sales-invoice": {
    title: "Sales Invoice",
    subtitle: "Billing flow",
    badge: "Invoice builder",
    hero: "Prepare a sales invoice.",
    highlight: "Ready to bill",
    highlightText: "Track the customer, items, tax, and total in a clear billing layout that is easy to review before sending.",
    invoice: true
  },
  "email-invoice": {
    title: "Email Invoice",
    subtitle: "Send flow",
    badge: "Messaging",
    hero: "Send the invoice by email.",
    highlight: "Send ready",
    highlightText: "Use this page to compose a simple message, confirm the recipient, and send the invoice quickly.",
    email: true
  },
  "customer-history": {
    title: "Customer History",
    subtitle: "Timeline",
    badge: "History timeline",
    hero: "Service and purchase history.",
    highlight: "History loaded",
    highlightText: "Keep the last visits, purchases, and invoice activity visible for quick staff follow-up.",
    history: true
  },
  "customer-reports": {
    title: "Customer Reports",
    subtitle: "Insights",
    badge: "Reporting",
    hero: "Customer report overview.",
    highlight: "Insight ready",
    highlightText: "Use this report page to understand service load, repeat customers, and billing progress at a glance.",
    reports: true
  }
};

export const publicPages = {
  about: {
    title: "About AutoBolt",
    eyebrow: "Public page",
    copy: "AutoBolt is an automotive-focused frontend concept for parts, invoices, booking, and service workflows.",
    cards: [
      ["Role aware", "The UI is split into admin, staff, and customer journeys."],
      ["Automotive feel", "Deep blues and orange accents keep the branding strong."],
      ["Frontend first", "The screens are built to be demo-ready before backend wiring."]
    ]
  },
  contact: {
    title: "Contact AutoBolt",
    eyebrow: "Public page",
    copy: "Use this page for support, sales, or project questions while the backend is being finalized.",
    cards: [
      ["Support email", "support@autobolt.local"],
      ["Phone", "+977-98XXXXXXXX"],
      ["Location", "Kathmandu, Nepal"]
    ]
  },
  "customer-register": {
    title: "Customer Register",
    eyebrow: "Public page",
    copy: "Public customer registration can be used as the first step before the staff or customer dashboard.",
    cards: [
      ["Sign up", "Create an account and capture contact information."],
      ["Vehicle info", "Attach the vehicle number and service notes."],
      ["Demo flow", "Route into the customer workspace after signup."]
    ]
  }
};

export const staffNav = [
  ["Dashboard", "staff-dashboard"],
  ["Customer Registration", "customer-registration"],
  ["Customer Search", "customer-search"],
  ["Customer Details", "customer-details"],
  ["Vehicle Details", "vehicle-details"],
  ["Sales Invoice", "sales-invoice"],
  ["Email Invoice", "email-invoice"],
  ["Customer History", "customer-history"],
  ["Customer Reports", "customer-reports"]
];

export const publicNav = [
  ["Landing", "home"],
  ["About", "about"],
  ["Contact", "contact"],
  ["Customer Register", "customer-register"],
  ["Sign In", "signin"],
  ["Sign Up", "signup"]
];

export const appRoutes = new Set([
  "home",
  "about",
  "contact",
  "customer-register",
  "signin",
  "signup",
  "admin",
  "staff",
  "customer",
  "admin-parts",
  "admin-customers",
  "admin-vendors",
  "admin-staff",
  "admin-sales",
  "admin-purchase",
  "admin-reports",
  "admin-inventory",
  "admin-notifications",
  "admin-settings",
  "admin-create-invoice",
  "admin-create-purchase",
  "admin-loyalty",
  ...Object.keys(staffPages)
]);
