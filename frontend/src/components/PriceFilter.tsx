type Props = {
  selectedPrice: number | undefined;
  onChange: (value: number | undefined) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <select
        className="w-full p-2 border border-slate-300 rounded"
        value={selectedPrice}
        onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : undefined)}
      >
        <option value="">Select Max Price</option>
        {['50', '100', '200', '300', '400', '500'].map((price) => (
          <option key={`price-${Math.random()}-${price}`} value={price}>
            {price}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PriceFilter;
