export const PoolSelector = () => (
  <select className="[&>option]:p-5 w-full rounded select opacity-60 hover:opacity-90 focus:opacity-90 focus:border-[var(--light-blue)] bg-[var(--dark-green)] transition ease-in-out duration-300">
    <option disabled selected>
      Select Pool
    </option>
    <option>30 Days</option>
    <option>60 Days</option>
    <option>90 Days</option>
  </select>
)
