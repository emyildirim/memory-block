const formatMemoriesForCSV = (memories) => {
  return memories.map(memory => ({
    title: memory.title,
    context: memory.context || '',
    tag: memory.tag || '',
    detail: memory.detail || '',
    createdAt: memory.createdAt.toISOString()
  }));
};

const generateCSV = (data, fields = ['title', 'context', 'tag', 'detail', 'createdAt']) => {
  const csvRows = [fields.join(',')];
  
  data.forEach(row => {
    const values = fields.map(field => {
      let value = row[field] || '';
      // Escape quotes and wrap in quotes if contains comma or newline
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        value = '"' + value.replace(/"/g, '""') + '"';
      }
      return value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

module.exports = {
  formatMemoriesForCSV,
  generateCSV
}; 