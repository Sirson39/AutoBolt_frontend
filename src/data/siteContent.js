import {
  BarChart3,
  Bell,
  Boxes,
  Gauge,
  ReceiptText,
  Sparkles,
  Tag,
  TrendingUp,
  Truck,
  Users,
  ShieldCheck
} from "lucide-react";

export const features = [
  {
    title: "Inventory Management",
    text: "Track stock levels, part categories, reorder points, and availability across your workshop and retail counter.",
    icon: Boxes
  },
  {
    title: "Sales & Invoice Management",
    text: "Create sales invoices quickly, keep billing records organized, and share invoices with customers when needed.",
    icon: ReceiptText
  },
  {
    title: "Vendor Management",
    text: "Maintain supplier records, purchase details, and vendor history in one clean operational workspace.",
    icon: Truck
  },
  {
    title: "Customer & Vehicle Records",
    text: "Store customer profiles, vehicle details, and service context for faster searches and better support.",
    icon: Users
  },
  {
    title: "Reports & Analytics",
    text: "Review sales, inventory, and finance summaries with clear reporting views for better decisions.",
    icon: BarChart3
  },
  {
    title: "Smart Notifications",
    text: "Stay informed with low-stock alerts, overdue credit reminders, and operational updates.",
    icon: Bell
  },
  {
    title: "AI Failure Prediction",
    text: "Use vehicle-pattern insights to anticipate part failure and improve maintenance planning.",
    icon: Sparkles
  },
  {
    title: "Loyalty Discount",
    text: "Apply customer rewards and discount logic consistently across billing and purchase history.",
    icon: Tag
  }
];

export const benefits = [
  {
    title: "Faster Daily Operations",
    text: "Reduce manual steps across sales, registration, billing, and stock updates.",
    icon: Gauge
  },
  {
    title: "Better Stock Control",
    text: "Keep inventory levels visible so reorder decisions happen before shortages affect sales.",
    icon: ShieldCheck
  },
  {
    title: "Improved Customer Experience",
    text: "Make it easier to register customers, manage vehicles, and share invoices or updates quickly.",
    icon: Users
  },
  {
    title: "Smarter Business Decisions",
    text: "Use reports, alerts, and AI-supported insights to understand demand and service trends.",
    icon: TrendingUp
  }
];

export const workflowSteps = [
  {
    step: "Step 01",
    title: "Stock Arrives",
    text: "Admin records vendor purchases and the system updates stock levels automatically."
  },
  {
    step: "Step 02",
    title: "Sale Happens",
    text: "Staff selects parts, registers customer details, and generates a sales invoice."
  },
  {
    step: "Step 03",
    title: "Customer Receives Invoice",
    text: "Invoices can be emailed directly to customers, and purchase history is saved."
  },
  {
    step: "Step 04",
    title: "System Tracks & Alerts",
    text: "AutoBolt monitors low stock, overdue credits, and AI-based vehicle part predictions."
  }
];

export const roleCards = {
  admin: {
    badge: "Admin",
    title: "Operations, stock, and oversight",
    description: "Admins manage the core business workflows, inventory controls, financial visibility, and user access.",
    items: [
      "Manage staff accounts and roles",
      "Manage parts, vendors, and stock levels",
      "Create purchase invoices",
      "View financial and inventory reports",
      "Receive low-stock alerts"
    ]
  },
  staff: {
    badge: "Staff",
    title: "Service desk and sales execution",
    description: "Staff handle customer intake, sales tasks, invoicing, and customer history at the point of service.",
    items: [
      "Register customers with vehicle details",
      "Search customers by name, phone, ID, or vehicle number",
      "Sell parts and create sales invoices",
      "Email invoices to customers",
      "View customer history and reports"
    ]
  },
  customer: {
    badge: "Customer",
    title: "Self-service and account management",
    description: "Customers can manage their profile, vehicle records, bookings, requests, and service feedback.",
    items: [
      "Self-register and manage profile",
      "Add and update vehicle details",
      "Book service appointments",
      "Request unavailable parts",
      "View purchase and service history",
      "Submit service reviews"
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
    leftBody: "This layout highlights reports, stock pressure, and management tasks that belong to the admin role.",
    rows: [
      ["Brake pads", "12", "Top seller", "good"],
      ["Air filters", "8", "Reorder soon", "warn"],
      ["Battery packs", "4", "Critical level", "danger"],
      ["Engine oil", "26", "Healthy", "good"]
    ],
    rightTitle: "Core tasks",
    rightBody: "These are the main actions requested in the system workflow.",
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
    rightBody: "The staff workspace keeps invoice creation, customer histories, and reports visible.",
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
    leftBody: "The customer role is centered around self-service, vehicle management, and transparent history.",
    rows: [
      ["Oil filter", "Purchased", "10 Apr", "good"],
      ["Appointment", "Booked", "18 Apr", "good"],
      ["Brake check", "Completed", "07 Apr", "good"],
      ["Battery alert", "Suggested", "Today", "warn"]
    ],
    rightTitle: "Customer tools",
    rightBody: "This workspace groups part requests, bookings, and AI prediction tools in one place.",
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
    hero: "This workspace keeps the staff flow focused on registrations, searches, customer records, and billing so daily work stays quick.",
    highlight: "Today's focus",
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
    eyebrow: "About",
    copy: "AutoBolt is a web-based Vehicle Parts Selling and Inventory Management System designed for vehicle service centres and parts retail businesses. It provides role-based access for admins, staff, and customers, helping each user complete their tasks through a clean and structured interface.",
    cards: [
      ["Role-Based Access", "Separate workflows are provided for admin, staff, and customer users."],
      ["Automotive-Focused Design", "The interface is designed around parts inventory, vehicle records, invoices, and service operations."],
      ["Smart System Support", "The system supports alerts, reports, customer history, and AI-based part failure prediction."]
    ]
  },
  contact: {
    title: "Contact AutoBolt",
    eyebrow: "Support",
    copy: "For support, service enquiries, or system-related questions, please use the contact details below.",
    cards: [
      ["Support Email", "support@autobolt.local"],
      ["Phone", "+977-98XXXXXXXX"],
      ["Location", "Kathmandu, Nepal"]
    ]
  },
  "customer-register": {
    title: "Customer Registration",
    eyebrow: "Registration",
    copy: "Create a customer account and capture key vehicle details in a structured setup designed for service and parts workflows.",
    cards: [
      ["Account setup", "Create a customer profile with essential contact information."],
      ["Vehicle details", "Add the vehicle number, model, and service notes."],
      ["Next step", "Continue into the customer workspace after registration."]
    ]
  }
};

export const publicNav = [
  { label: "Home", target: "home", kind: "section" },
  { label: "Features", target: "home-features", kind: "section" },
  { label: "Workflow", target: "home-workflow", kind: "section" },
  { label: "Roles", target: "home-roles", kind: "section" },
  { label: "About", target: "about", kind: "page" },
  { label: "Contact", target: "contact", kind: "page" },
  { label: "Customer Registration", target: "customer-register", kind: "page" },
  { label: "Sign In", target: "signin", kind: "action" },
  { label: "Get Started", target: "signup", kind: "action" }
];

export const footerNav = [
  { label: "Home", target: "home" },
  { label: "Features", target: "home-features" },
  { label: "Roles", target: "home-roles" },
  { label: "About", target: "about" },
  { label: "Contact", target: "contact" },
  { label: "Sign In", target: "signin" }
];

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
  "admin-vehicles",
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
