const Memory = require('../models/Memory');

// Get all memories for user with optional search and filter
const getMemories = async (req, res) => {
  try {
    const { query, filter } = req.query;
    let searchFilter = { userId: req.user._id };

    if (query && filter) {
      switch (filter) {
        case 'title':
          searchFilter.title = { $regex: query, $options: 'i' };
          break;
        case 'context':
          searchFilter.context = { $regex: query, $options: 'i' };
          break;
        case 'tag':
          searchFilter.tag = { $regex: query, $options: 'i' };
          break;
        case 'all':
          searchFilter.$or = [
            { title: { $regex: query, $options: 'i' } },
            { context: { $regex: query, $options: 'i' } },
            { tag: { $regex: query, $options: 'i' } },
            { detail: { $regex: query, $options: 'i' } }
          ];
          break;
      }
    }

    const memories = await Memory.find(searchFilter)
      .sort({ createdAt: -1 })
      .populate('userId', 'username');

    res.json(memories);
  } catch (error) {
    console.error('Get memories error:', error);
    res.status(500).json({ message: 'Server error fetching memories' });
  }
};

// Get single memory
const getMemory = async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    res.json(memory);
  } catch (error) {
    console.error('Get memory error:', error);
    res.status(500).json({ message: 'Server error fetching memory' });
  }
};

// Create new memory
const createMemory = async (req, res) => {
  try {
    const { title, context, tag, detail } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const memory = new Memory({
      userId: req.user._id,
      title,
      context,
      tag,
      detail
    });

    await memory.save();
    res.status(201).json(memory);
  } catch (error) {
    console.error('Create memory error:', error);
    res.status(500).json({ message: 'Server error creating memory' });
  }
};

// Update memory
const updateMemory = async (req, res) => {
  try {
    const { title, context, tag, detail } = req.body;

    const memory = await Memory.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, context, tag, detail },
      { new: true, runValidators: true }
    );

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    res.json(memory);
  } catch (error) {
    console.error('Update memory error:', error);
    res.status(500).json({ message: 'Server error updating memory' });
  }
};

// Delete memory
const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    console.error('Delete memory error:', error);
    res.status(500).json({ message: 'Server error deleting memory' });
  }
};

// Export memories as CSV
const exportMemories = async (req, res) => {
  try {
    const memories = await Memory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    if (memories.length === 0) {
      return res.status(404).json({ message: 'No memories to export' });
    }

    // Format data for CSV
    const csvData = memories.map(memory => ({
      title: memory.title,
      context: memory.context || '',
      tag: memory.tag || '',
      detail: memory.detail || '',
      createdAt: memory.createdAt.toISOString()
    }));

    // Simple CSV conversion function
    const convertToCSV = (data) => {
      const headers = ['title', 'context', 'tag', 'detail', 'createdAt'];
      const csvRows = [headers.join(',')];
      
      data.forEach(row => {
        const values = headers.map(header => {
          let value = row[header] || '';
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

    const csv = convertToCSV(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment('memories.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export memories error:', error);
    res.status(500).json({ message: 'Server error exporting memories' });
  }
};

module.exports = {
  getMemories,
  getMemory,
  createMemory,
  updateMemory,
  deleteMemory,
  exportMemories
}; 