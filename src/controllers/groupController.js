exports.updateGroupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const group = await Group.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );
    if (!group) return res.status(404).json({ msg: "Group not found" });

    res.json({ msg: "Group status updated successfully", group });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};