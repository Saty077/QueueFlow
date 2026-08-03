export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={styles.card}>
      <p style={styles.value}>{value}</p>
      <p style={styles.label}>{label}</p>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    minWidth: "120px",
  },
  value: { margin: 0, fontSize: "28px", fontWeight: 600 },
  label: { margin: 0, fontSize: "13px", color: "#666" },
};
