import React, { useState, useEffect, useCallback } from "react";
import { staffNav } from "../../data/siteContent";
import { clearAuth, getUser } from "../../utils/auth";
import api from "../../utils/api";
import toast from "react-hot-toast";

function getHashParam(name) {
  const hash = window.location.hash.replace(/^#[^?]*\??/, "");
  return new URLSearchParams(hash).get(name);
}

export default function StaffWorkspace({ routeKey, onNavigate }) {
  const isNavActive = (key) => key === routeKey;
  const currentUser = getUser();

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#home" aria-label="AutoBolt home">
            <div className="brand-mark">A</div>
            <div className="brand-copy">
              <div>AutoBolt</div>
              <span>Vehicle Parts Management</span>
            </div>
          </a>
          <div className="header-actions">
            {currentUser && (
              <span style={{ fontSize: "0.82rem", color: "var(--ink-soft)", marginRight: 8 }}>
                {currentUser.fullName}
              </span>
            )}
            <button className="btn btn-secondary" type="button" onClick={() => onNavigate("change-password")}>Change Password</button>
            <button className="btn btn-secondary" type="button" onClick={() => onNavigate("update-profile")}>Profile</button>
            <button className="btn btn-danger" type="button" onClick={() => { clearAuth(); onNavigate("signin"); }}>Logout</button>
          </div>
        </div>
      </header>

      <main className="page-shell staff-page">
        <section className="staff-shell">
          <aside className="staff-sidebar">
            <div className="brand">
              <div className="brand-mark">S</div>
              <div className="brand-copy">
                <div>Staff Workspace</div>
                <span>Daily service flow</span>
              </div>
            </div>
            <p className="staff-brand-note">Fast access to registration, search, customer details, invoices, and reporting.</p>
            <nav className="staff-nav" aria-label="Staff navigation">
              {staffNav.map(([label, target]) => (
                <a key={target} className={`staff-nav-link ${isNavActive(target) ? "active" : ""}`} href={`#${target}`}>
                  {label} <span>{label.split(" ")[0]}</span>
                </a>
              ))}
            </nav>
          </aside>

          <section className="staff-main">
            <div className="header-actions" style={{ marginBottom: 16 }}>
              <button className="btn btn-secondary" type="button" onClick={() => onNavigate("staff-dashboard")}>Dashboard</button>
              <button className="btn btn-primary" type="button" onClick={() => onNavigate("sales-invoice")}>New Invoice</button>
            </div>

            {routeKey === "staff-dashboard" && <StaffDashboard onNavigate={onNavigate} />}
            {routeKey === "customer-registration" && <CustomerRegistration onNavigate={onNavigate} />}
            {routeKey === "customer-search" && <CustomerSearch onNavigate={onNavigate} />}
            {routeKey === "customer-details" && <CustomerDetails onNavigate={onNavigate} />}
            {routeKey === "vehicle-details" && <VehicleDetails onNavigate={onNavigate} />}
            {routeKey === "sales-invoice" && <SalesInvoice onNavigate={onNavigate} />}
            {routeKey === "email-invoice" && <EmailInvoice onNavigate={onNavigate} />}
            {routeKey === "customer-history" && <CustomerHistory onNavigate={onNavigate} />}
            {routeKey === "customer-reports" && <CustomerReports />}
          </section>
        </section>
      </main>
    </>
  );
}

function StaffDashboard({ onNavigate }) {
  return (
    <div>
      <h1 className="page-heading">Staff Workspace</h1>
      <p className="page-copy">Customer handling and invoice operations.</p>
      <div className="staff-grid-2" style={{ marginTop: 20 }}>
        <article className="card">
          <h3>Quick actions</h3>
          <div className="staff-form-actions" style={{ flexWrap: "wrap", gap: 10, marginTop: 12 }}>
            <button className="btn btn-primary" onClick={() => onNavigate("customer-registration")}>Register Customer</button>
            <button className="btn btn-secondary" onClick={() => onNavigate("customer-search")}>Search Customer</button>
            <button className="btn btn-secondary" onClick={() => onNavigate("sales-invoice")}>New Invoice</button>
            <button className="btn btn-secondary" onClick={() => onNavigate("email-invoice")}>Email Invoice</button>
          </div>
        </article>
        <article className="card">
          <h3>Reports</h3>
          <div className="staff-form-actions" style={{ marginTop: 12 }}>
            <button className="btn btn-secondary" onClick={() => onNavigate("customer-reports")}>View Reports</button>
          </div>
        </article>
      </div>
    </div>
  );
}

function CustomerRegistration({ onNavigate }) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", address: "",
    vehicleLicensePlate: "", vehicleMake: "", vehicleModel: "",
    vehicleYear: new Date().getFullYear(), vehicleMileage: 0, vehiclePlateType: 1,
  });
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const t = toast.loading("Registering customer...");
    try {
      const payload = {
        ...form,
        vehicleYear: parseInt(form.vehicleYear),
        vehicleMileage: parseFloat(form.vehicleMileage) || 0,
        vehiclePlateType: parseInt(form.vehiclePlateType),
      };
      const res = await api.post("/api/customers/register", payload);
      toast.success("Customer registered", { id: t });
      onNavigate(`customer-details?id=${res.data.customer.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", { id: t });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="staff-grid-2">
      <article className="card">
        <h3>Customer details</h3>
        <form className="staff-form" onSubmit={handleSubmit}>
          <div className="field-row">
            <label className="field-label">Full name<input className="form-input" required value={form.fullName} onChange={set("fullName")} placeholder="Customer name" /></label>
            <label className="field-label">Phone<input className="form-input" required value={form.phone} onChange={set("phone")} placeholder="98XXXXXXXX" /></label>
          </div>
          <div className="field-row">
            <label className="field-label">Email<input className="form-input" type="email" value={form.email} onChange={set("email")} placeholder="name@example.com" /></label>
            <label className="field-label">Address<input className="form-input" value={form.address} onChange={set("address")} placeholder="City or street" /></label>
          </div>
          <h4 style={{ marginTop: 16, marginBottom: 8 }}>Vehicle</h4>
          <div className="field-row">
            <label className="field-label">License plate<input className="form-input" required value={form.vehicleLicensePlate} onChange={set("vehicleLicensePlate")} placeholder="Ba 1 Cha 1234" /></label>
            <label className="field-label">Plate type
              <select className="form-input" value={form.vehiclePlateType} onChange={set("vehiclePlateType")}>
                <option value={1}>Private</option>
                <option value={2}>Commercial</option>
                <option value={3}>Government</option>
              </select>
            </label>
          </div>
          <div className="field-row">
            <label className="field-label">Make<input className="form-input" required value={form.vehicleMake} onChange={set("vehicleMake")} placeholder="Toyota" /></label>
            <label className="field-label">Model<input className="form-input" required value={form.vehicleModel} onChange={set("vehicleModel")} placeholder="Corolla" /></label>
          </div>
          <div className="field-row">
            <label className="field-label">Year<input className="form-input" type="number" min="1900" max="2100" value={form.vehicleYear} onChange={set("vehicleYear")} /></label>
            <label className="field-label">Mileage (km)<input className="form-input" type="number" min="0" value={form.vehicleMileage} onChange={set("vehicleMileage")} /></label>
          </div>
          <div className="staff-form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>Save registration</button>
            <button type="button" className="btn btn-secondary" onClick={() => onNavigate("customer-search")}>Search existing</button>
          </div>
        </form>
      </article>
      <article className="card">
        <h3>Intake checklist</h3>
        <ul className="checklist">
          {["Verify customer identity", "Confirm phone number is reachable", "Record accurate license plate", "Note vehicle condition on arrival", "Check for any outstanding invoices"].map((item, i) => (
            <li key={item}><span className="check-dot">{i + 1}</span><span>{item}</span></li>
          ))}
        </ul>
      </article>
    </div>
  );
}

function CustomerSearch({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/api/customers/search?query=${encodeURIComponent(query)}`);
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-grid-2">
      <article className="card">
        <div className="staff-toolbar">
          <div>
            <h3>Search records</h3>
            <p>Search by name, phone, or email.</p>
          </div>
        </div>
        <form className="staff-searchbar" style={{ marginTop: 14 }} onSubmit={search}>
          <input type="search" placeholder="Name, phone, email..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" className="btn btn-primary" disabled={loading}>Search</button>
        </form>
        <div className="staff-form-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={() => onNavigate("customer-registration")}>Register new</button>
        </div>
      </article>
      <article className="card">
        <h3>Results</h3>
        {loading && <p className="subtle">Searching...</p>}
        {!loading && searched && results.length === 0 && <p className="subtle">No customers found.</p>}
        {results.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Phone</th><th>Action</th></tr>
              </thead>
              <tbody>
                {results.map((c) => (
                  <tr key={c.id}>
                    <td>{c.fullName}</td>
                    <td>{c.phone}</td>
                    <td>
                      <button className="btn btn-secondary" onClick={() => onNavigate(`customer-details?id=${c.id}`)}>Open</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}

function CustomerDetails({ onNavigate }) {
  const [customerId, setCustomerId] = useState(() => getHashParam("id"));
  const [customer, setCustomer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onHash = () => setCustomerId(getHashParam("id"));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!customerId) return;
    api.get(`/api/customers/${customerId}`).then((res) => {
      setCustomer(res.data);
      setForm({ fullName: res.data.fullName, email: res.data.email || "", phone: res.data.phone, address: res.data.address || "" });
    }).catch(() => toast.error("Failed to load customer"));
  }, [customerId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const t = toast.loading("Saving...");
    try {
      await api.put(`/api/customers/${customerId}`, form);
      setCustomer((p) => ({ ...p, ...form }));
      setEditing(false);
      toast.success("Updated", { id: t });
    } catch {
      toast.error("Save failed", { id: t });
    } finally {
      setSaving(false);
    }
  };

  if (!customerId) return <p className="subtle">No customer selected. Use <button className="btn btn-secondary" onClick={() => onNavigate("customer-search")}>Search</button> to find one.</p>;
  if (!customer) return <p className="subtle">Loading...</p>;

  return (
    <div className="staff-grid-2">
      <article className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Profile</h3>
          <button className="btn btn-secondary" onClick={() => setEditing((p) => !p)}>{editing ? "Cancel" : "Edit"}</button>
        </div>
        {editing ? (
          <form className="staff-form" onSubmit={handleSave}>
            <label className="field-label">Full name<input className="form-input" required value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} /></label>
            <label className="field-label">Phone<input className="form-input" required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></label>
            <label className="field-label">Email<input className="form-input" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></label>
            <label className="field-label">Address<input className="form-input" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} /></label>
            <div className="staff-form-actions"><button type="submit" className="btn btn-primary" disabled={saving}>Save</button></div>
          </form>
        ) : (
          <div className="staff-summary-list">
            {[["Name", customer.fullName], ["Phone", customer.phone], ["Email", customer.email || "—"], ["Address", customer.address || "—"], ["Credit balance", `Rs ${customer.creditBalance?.toLocaleString()}`]].map(([label, val]) => (
              <div key={label} className="summary-item"><span className="subtle">{label}</span><span>{val}</span></div>
            ))}
          </div>
        )}
      </article>
      <article className="card">
        <h3>Actions</h3>
        <div className="staff-form-actions" style={{ flexWrap: "wrap", gap: 10, marginTop: 12 }}>
          <button className="btn btn-primary" onClick={() => onNavigate(`vehicle-details?customerId=${customerId}`)}>Vehicles</button>
          <button className="btn btn-secondary" onClick={() => onNavigate(`sales-invoice?customerId=${customerId}`)}>New invoice</button>
          <button className="btn btn-secondary" onClick={() => onNavigate(`customer-history?id=${customerId}`)}>History</button>
          <button className="btn btn-secondary" onClick={() => onNavigate("customer-search")}>Back to search</button>
        </div>
      </article>
    </div>
  );
}

function VehicleDetails({ onNavigate }) {
  const [customerId] = useState(() => getHashParam("customerId"));
  const [vehicles, setVehicles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ licensePlate: "", make: "", model: "", year: new Date().getFullYear(), mileage: 0, plateType: 1, customerId: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    if (!customerId) return;
    api.get(`/api/vehicles/customer/${customerId}`).then((res) => setVehicles(Array.isArray(res.data) ? res.data : [])).catch(() => toast.error("Failed to load vehicles"));
  }, [customerId]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    const t = toast.loading("Adding vehicle...");
    try {
      await api.post("/api/vehicles", { ...form, customerId: parseInt(customerId), year: parseInt(form.year), mileage: parseFloat(form.mileage) || 0, plateType: parseInt(form.plateType) });
      toast.success("Vehicle added", { id: t });
      setShowAdd(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed", { id: t });
    } finally {
      setSaving(false);
    }
  };

  if (!customerId) return <p className="subtle">No customer selected.</p>;

  return (
    <div className="staff-grid-2">
      <article className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Vehicles</h3>
          <button className="btn btn-primary" onClick={() => setShowAdd((p) => !p)}>{showAdd ? "Cancel" : "+ Add"}</button>
        </div>
        {showAdd && (
          <form className="staff-form" onSubmit={handleAdd} style={{ marginBottom: 16 }}>
            <div className="field-row">
              <label className="field-label">Plate<input className="form-input" required value={form.licensePlate} onChange={(e) => setForm((p) => ({ ...p, licensePlate: e.target.value }))} /></label>
              <label className="field-label">Type
                <select className="form-input" value={form.plateType} onChange={(e) => setForm((p) => ({ ...p, plateType: e.target.value }))}>
                  <option value={1}>Private</option><option value={2}>Commercial</option><option value={3}>Government</option>
                </select>
              </label>
            </div>
            <div className="field-row">
              <label className="field-label">Make<input className="form-input" required value={form.make} onChange={(e) => setForm((p) => ({ ...p, make: e.target.value }))} /></label>
              <label className="field-label">Model<input className="form-input" required value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} /></label>
            </div>
            <div className="field-row">
              <label className="field-label">Year<input className="form-input" type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} /></label>
              <label className="field-label">Mileage<input className="form-input" type="number" value={form.mileage} onChange={(e) => setForm((p) => ({ ...p, mileage: e.target.value }))} /></label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>Save</button>
          </form>
        )}
        {vehicles.length === 0 ? <p className="subtle">No vehicles on file.</p> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Plate</th><th>Make / Model</th><th>Year</th><th></th></tr></thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} className={selected?.id === v.id ? "row-active" : ""}>
                    <td>{v.licensePlate}</td>
                    <td>{v.make} {v.model}</td>
                    <td>{v.year}</td>
                    <td><button className="btn btn-secondary" onClick={() => setSelected(v)}>Select</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
      <article className="card">
        <h3>Vehicle detail</h3>
        {selected ? (
          <div className="staff-summary-list">
            {[["Plate", selected.licensePlate], ["Make", selected.make], ["Model", selected.model], ["Year", selected.year], ["Mileage", `${selected.mileage?.toLocaleString()} km`], ["Owner", selected.ownerName]].map(([l, v]) => (
              <div key={l} className="summary-item"><span className="subtle">{l}</span><span>{v}</span></div>
            ))}
            <div className="staff-form-actions" style={{ marginTop: 12 }}>
              <button className="btn btn-primary" onClick={() => onNavigate(`sales-invoice?customerId=${customerId}&vehicleId=${selected.id}`)}>Invoice for this vehicle</button>
            </div>
          </div>
        ) : <p className="subtle">Select a vehicle to see details.</p>}
      </article>
    </div>
  );
}

function SalesInvoice({ onNavigate }) {
  const initCustomerId = getHashParam("customerId");
  const initVehicleId = getHashParam("vehicleId");

  const [customerQuery, setCustomerQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initVehicleId || "");
  const [partQuery, setPartQuery] = useState("");
  const [parts, setParts] = useState([]);
  const [cart, setCart] = useState([]);
  const [taxRate] = useState(0.13);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initCustomerId) {
      api.get(`/api/customers/${initCustomerId}`).then((res) => {
        setSelectedCustomer(res.data);
        api.get(`/api/vehicles/customer/${initCustomerId}`).then((r) => setVehicles(Array.isArray(r.data) ? r.data : []));
      });
    }
    api.get("/api/parts").then((res) => setParts(Array.isArray(res.data) ? res.data : []));
  }, []);

  const searchCustomers = async (e) => {
    e.preventDefault();
    if (!customerQuery.trim()) return;
    try {
      const res = await api.get(`/api/customers/search?query=${encodeURIComponent(customerQuery)}`);
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch { toast.error("Search failed"); }
  };

  const selectCustomer = async (c) => {
    setSelectedCustomer(c);
    setCustomers([]);
    setCustomerQuery("");
    const res = await api.get(`/api/vehicles/customer/${c.id}`);
    setVehicles(Array.isArray(res.data) ? res.data : []);
  };

  const filteredParts = parts.filter((p) =>
    !partQuery || p.name.toLowerCase().includes(partQuery.toLowerCase()) || p.category?.toLowerCase().includes(partQuery.toLowerCase())
  );

  const addToCart = (part) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.partId === part.id);
      if (existing) return prev.map((i) => i.partId === part.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { partId: part.id, name: part.name, price: part.price, quantity: 1 }];
    });
  };

  const updateQty = (partId, qty) => {
    if (qty < 1) { setCart((p) => p.filter((i) => i.partId !== partId)); return; }
    setCart((p) => p.map((i) => i.partId === partId ? { ...i, quantity: qty } : i));
  };

  const subTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subTotal * taxRate;
  const total = subTotal + tax;

  const handleSubmit = async () => {
    if (!selectedCustomer) { toast.error("Select a customer first"); return; }
    if (cart.length === 0) { toast.error("Add at least one item"); return; }
    setSaving(true);
    const t = toast.loading("Creating invoice...");
    try {
      const res = await api.post("/api/invoices", {
        customerId: selectedCustomer.id,
        vehicleId: selectedVehicleId ? parseInt(selectedVehicleId) : null,
        status: 0,
        taxRate,
        items: cart.map((i) => ({ partId: i.partId, quantity: i.quantity })),
      });
      toast.success(`Invoice ${res.data.invoiceNumber} created`, { id: t });
      onNavigate(`email-invoice?id=${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create invoice", { id: t });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="invoice-layout">
      <article className="card invoice-box">
        <h3>New Invoice</h3>

        {!selectedCustomer ? (
          <div style={{ marginBottom: 16 }}>
            <form className="staff-searchbar" onSubmit={searchCustomers} style={{ marginBottom: 10 }}>
              <input type="search" placeholder="Search customer by name or phone..." value={customerQuery} onChange={(e) => setCustomerQuery(e.target.value)} />
              <button type="submit" className="btn btn-primary">Find</button>
            </form>
            {customers.length > 0 && (
              <div className="table-wrap">
                <table className="table">
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id}>
                        <td>{c.fullName}</td>
                        <td>{c.phone}</td>
                        <td><button className="btn btn-secondary" onClick={() => selectCustomer(c)}>Select</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span><strong>{selectedCustomer.fullName}</strong> — {selectedCustomer.phone}</span>
            <button className="btn btn-secondary" onClick={() => { setSelectedCustomer(null); setVehicles([]); setSelectedVehicleId(""); }}>Change</button>
          </div>
        )}

        {vehicles.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <label className="field-label">Vehicle (optional)
              <select className="form-input" value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)}>
                <option value="">— No vehicle —</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.licensePlate} — {v.make} {v.model}</option>)}
              </select>
            </label>
          </div>
        )}

        <div style={{ marginBottom: 10 }}>
          <input className="form-input" placeholder="Filter parts by name or category..." value={partQuery} onChange={(e) => setPartQuery(e.target.value)} style={{ marginBottom: 8 }} />
          <div className="table-wrap" style={{ maxHeight: 180, overflowY: "auto" }}>
            <table className="table">
              <thead><tr><th>Part</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
              <tbody>
                {filteredParts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>Rs {p.price?.toLocaleString()}</td>
                    <td><span className={`status ${p.stockQuantity < 1 ? "danger" : p.isLowStock ? "warn" : "good"}`}>{p.stockQuantity}</span></td>
                    <td><button className="btn btn-secondary" disabled={p.stockQuantity < 1} onClick={() => addToCart(p)}>Add</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {cart.length > 0 && (
          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table className="table">
              <thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th><th></th></tr></thead>
              <tbody>
                {cart.map((i) => (
                  <tr key={i.partId}>
                    <td>{i.name}</td>
                    <td><input type="number" min="1" value={i.quantity} onChange={(e) => updateQty(i.partId, parseInt(e.target.value))} style={{ width: 60 }} className="form-input" /></td>
                    <td>Rs {i.price?.toLocaleString()}</td>
                    <td>Rs {(i.price * i.quantity).toLocaleString()}</td>
                    <td><button className="btn btn-secondary" onClick={() => updateQty(i.partId, 0)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <article className="card invoice-total">
        <h3>Summary</h3>
        <div className="staff-summary-list">
          <div className="summary-item"><span>Subtotal</span><span>Rs {subTotal.toLocaleString()}</span></div>
          <div className="summary-item"><span>Tax (13%)</span><span>Rs {tax.toFixed(0)}</span></div>
          <div className="summary-item"><strong>Total</strong><strong>Rs {total.toFixed(0)}</strong></div>
        </div>
        <div className="staff-form-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || !selectedCustomer || cart.length === 0}>Create invoice</button>
        </div>
      </article>
    </div>
  );
}

function EmailInvoice({ onNavigate }) {
  const initId = getHashParam("id");
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [query, setQuery] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get("/api/invoices").then((res) => {
      const list = Array.isArray(res.data) ? res.data : [];
      setInvoices(list);
      if (initId) {
        const found = list.find((i) => i.id === parseInt(initId));
        if (found) { setSelected(found); setRecipientEmail(found.customerEmail || ""); }
      }
    }).catch(() => toast.error("Failed to load invoices"));
  }, []);

  const handleSend = async () => {
    if (!selected) { toast.error("Select an invoice"); return; }
    setSending(true);
    const t = toast.loading("Sending...");
    try {
      const url = recipientEmail ? `/api/invoices/${selected.id}/email?recipientEmail=${encodeURIComponent(recipientEmail)}` : `/api/invoices/${selected.id}/email`;
      await api.post(url);
      toast.success("Invoice emailed", { id: t });
    } catch (err) {
      toast.error(err.response?.data?.message || "Send failed", { id: t });
    } finally {
      setSending(false);
    }
  };

  const filtered = invoices.filter((i) =>
    !query || i.invoiceNumber?.toLowerCase().includes(query.toLowerCase()) || i.customerName?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="staff-grid-2">
      <article className="card">
        <h3>Select invoice</h3>
        <input className="form-input" placeholder="Search by number or customer..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ marginBottom: 10 }} />
        <div className="table-wrap" style={{ maxHeight: 300, overflowY: "auto" }}>
          <table className="table">
            <thead><tr><th>Number</th><th>Customer</th><th>Total</th><th></th></tr></thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className={selected?.id === inv.id ? "row-active" : ""}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.customerName}</td>
                  <td>Rs {inv.totalAmount?.toLocaleString()}</td>
                  <td><button className="btn btn-secondary" onClick={() => { setSelected(inv); setRecipientEmail(inv.customerEmail || ""); }}>Select</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="card">
        <h3>Send email</h3>
        {selected ? (
          <>
            <div className="staff-summary-list" style={{ marginBottom: 12 }}>
              <div className="summary-item"><span>Invoice</span><span>{selected.invoiceNumber}</span></div>
              <div className="summary-item"><span>Customer</span><span>{selected.customerName}</span></div>
              <div className="summary-item"><span>Total</span><span>Rs {selected.totalAmount?.toLocaleString()}</span></div>
              <div className="summary-item"><span>Status</span><span className={`status ${selected.status === "Paid" ? "good" : "warn"}`}>{selected.status}</span></div>
            </div>
            <label className="field-label">Recipient email
              <input className="form-input" type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="Leave blank to use customer email" />
            </label>
            <div className="staff-form-actions" style={{ marginTop: 12 }}>
              <button className="btn btn-primary" onClick={handleSend} disabled={sending}>Send invoice</button>
              <button className="btn btn-secondary" onClick={() => onNavigate("sales-invoice")}>New invoice</button>
            </div>
          </>
        ) : <p className="subtle">Select an invoice from the list.</p>}
      </article>
    </div>
  );
}

function CustomerHistory({ onNavigate }) {
  const [customerId] = useState(() => getHashParam("id"));
  const [history, setHistory] = useState(null);

  useEffect(() => {
    if (!customerId) return;
    api.get(`/api/customers/${customerId}/history`).then((res) => setHistory(res.data)).catch(() => toast.error("Failed to load history"));
  }, [customerId]);

  if (!customerId) return <p className="subtle">No customer selected. <button className="btn btn-secondary" onClick={() => onNavigate("customer-search")}>Search</button></p>;
  if (!history) return <p className="subtle">Loading...</p>;

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <h2 className="page-heading">{history.fullName}</h2>
        <p className="subtle">{history.phone} {history.email ? `· ${history.email}` : ""}</p>
      </div>

      <div className="staff-grid-2">
        <article className="card">
          <h3>Vehicles ({history.vehicles?.length ?? 0})</h3>
          {history.vehicles?.length > 0 ? (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Plate</th><th>Make / Model</th><th>Year</th></tr></thead>
                <tbody>
                  {history.vehicles.map((v) => (
                    <tr key={v.id}><td>{v.licensePlate}</td><td>{v.make} {v.model}</td><td>{v.year}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="subtle">No vehicles on file.</p>}
        </article>

        <article className="card">
          <h3>Invoices ({history.invoices?.length ?? 0})</h3>
          {history.invoices?.length > 0 ? (
            <div className="table-wrap" style={{ maxHeight: 200, overflowY: "auto" }}>
              <table className="table">
                <thead><tr><th>Number</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {history.invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td>{inv.invoiceNumber}</td>
                      <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                      <td>Rs {inv.totalAmount?.toLocaleString()}</td>
                      <td><span className={`status ${inv.status === "Paid" ? "good" : inv.status === "Cancelled" ? "danger" : "warn"}`}>{inv.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="subtle">No invoices yet.</p>}
        </article>
      </div>

      {history.purchasedParts?.length > 0 && (
        <article className="card" style={{ marginTop: 16 }}>
          <h3>Parts purchased</h3>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Part</th><th>Qty</th><th>Date</th></tr></thead>
              <tbody>
                {history.purchasedParts.map((p, i) => (
                  <tr key={i}><td>{p.partName}</td><td>{p.quantity}</td><td>{new Date(p.purchaseDate).toLocaleDateString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </>
  );
}

function CustomerReports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/api/reports/staff").then((res) => setData(res.data)).catch(() => toast.error("Failed to load reports"));
  }, []);

  if (!data) return <p className="subtle">Loading reports...</p>;

  return (
    <>
      <div className="staff-grid-2">
        <article className="card">
          <h3>Top spenders</h3>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Customer</th><th>Orders</th><th>Total spent</th></tr></thead>
              <tbody>
                {data.topSpenders?.map((s) => (
                  <tr key={s.customerId}>
                    <td>{s.customerName}</td>
                    <td>{s.orders}</td>
                    <td>Rs {s.totalSpent?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card">
          <h3>Regular customers</h3>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Customer</th><th>Visits</th><th>Invoices</th></tr></thead>
              <tbody>
                {data.regulars?.map((r) => (
                  <tr key={r.customerId}>
                    <td>{r.customerName}</td>
                    <td>{r.visitCount}</td>
                    <td>{r.invoiceCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      {data.pendingCredits?.length > 0 && (
        <article className="card" style={{ marginTop: 16 }}>
          <h3>Pending credits</h3>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Customer</th><th>Outstanding</th><th>Days overdue</th><th>Phone</th></tr></thead>
              <tbody>
                {data.pendingCredits.map((c) => (
                  <tr key={c.customerId}>
                    <td>{c.customerName}</td>
                    <td>Rs {c.outstandingAmount?.toLocaleString()}</td>
                    <td><span className={`status ${c.daysOutstanding > 60 ? "danger" : "warn"}`}>{c.daysOutstanding}d</span></td>
                    <td>{c.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </>
  );
}
