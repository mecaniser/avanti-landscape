import { createCustomer } from "../actions";

export default function NewCustomerPage() {
  return (
    <>
      <h2>Add Customer</h2>
      <p className="subtitle">Manually add an existing customer to the CRM.</p>

      <div className="admin-card">
        <form action={createCustomer} className="admin-form">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" name="phone" />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />

          <label htmlFor="address">Property Address</label>
          <input type="text" id="address" name="address" />

          <label htmlFor="serviceType">Service</label>
          <input type="text" id="serviceType" name="serviceType" />

          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue="active">
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={4} />

          <button type="submit" className="admin-btn">Add Customer</button>
        </form>
      </div>
    </>
  );
}
