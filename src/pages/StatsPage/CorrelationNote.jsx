import { calculateCorrelation } from "../../utils/calculateCorrelation";

const CorrelationNote = ({ data, xKey, yKey, t }) => {
  if (!data || data.length < 3) return null;

  const xValues = data.map(d => d[xKey]).filter(v => v != null);
  const yValues = data.map(d => d[yKey]).filter(v => v != null);

  const correlation = calculateCorrelation(xValues, yValues);
  if (!correlation || isNaN(correlation)) return null;

  let message = t("correlation.none");
  if (correlation > 0.6) {
    message = t("correlation.positive");
  } else if (correlation < -0.6) {
    message = t("correlation.negative");
  }

  return (
    <p className="mt-2 text-sm text-gray-700">
      {message}
    </p>
  );
};

export default CorrelationNote;
