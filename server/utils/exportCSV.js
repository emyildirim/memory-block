const { Parser } = require('json2csv');

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
  const parser = new Parser({ fields });
  return parser.parse(data);
};

module.exports = {
  formatMemoriesForCSV,
  generateCSV
}; 