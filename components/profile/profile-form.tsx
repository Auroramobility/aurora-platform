export function ProfileForm() {
  return (
    <form className="space-y-6 rounded-xl border bg-white p-8 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Full Name</label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Phone Number</label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="+1 555 123 4567"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Country</label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="United States"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            State / Province
          </label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="California"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">Address</label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="123 Main Street"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">City</label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Los Angeles"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Postal Code</label>

          <input className="w-full rounded-lg border p-3" placeholder="90001" />
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        Save Profile
      </button>
    </form>
  );
}
