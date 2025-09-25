New Chat
117 lines

      for (let j = 0; j < count; j++) {
        const item = items[taskIndex++];
        tasks.push(new Task({
          firstName: item.firstName,
          phone: item.phone,
          notes: item.notes,
          agent: agents[i]._id
        }));
      }
    }
    // Save all tasks
    await Task.insertMany(tasks);
    res.json({ msg: `Successfully distributed ${items.length} items to ${numAgents} agents.`, count: items.length });
  } catch (err) {
    res.status(400).json({ msg: err.message || 'Upload failed' });
  }
});
// Get Distributed Lists (grouped by agent, protected)
router.get('/lists', auth, async (req, res) => {
  try {
    const tasks = await Task.find().populate('agent', 'name email mobile');
    // Group by agent
    const grouped = tasks.reduce((acc, task) => {
      const agentId = task.agent._id.toString();
      if (!acc[agentId]) acc[agentId] = { agent: task.agent, items: [] };
      acc[agentId].items.push({
        firstName: task.firstName,
        phone: task.phone,
        notes: task.notes
      });
      return acc;
    }, {});
    res.json({ lists: Object.values(grouped) });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
module.exports = router;
