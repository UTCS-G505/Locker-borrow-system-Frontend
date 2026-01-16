function generateCSV({ titleLines = [], columns, records }) {
  const headers = columns.map(c => c.label).join(',');

  const rows = records.map(({ record, user }) =>
    columns
      .map(c => `"${String(c.get(record, user)).replaceAll('"', '""')}"`)
      .join(',')
  );

  return [
    ...titleLines,
    headers,
    ...rows
  ].join('\n');
}

export default generateCSV