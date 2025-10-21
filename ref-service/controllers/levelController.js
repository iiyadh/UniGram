const { Level } = require('../models');

const createLevel = async (req, res) => {
    try{
        const level = await Level.create(req.body);
        res.status(201).json(level);
    }catch(err){
        res.status(400).json({ message: err.message });
    }
};

const getLevelsBySpecId = async (req, res) => {
    try{
        const { specId } = req.params;
        const levels = await Level.findAll({where : { specialityId: specId }});
        res.status(200).json(levels);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};

const getLevelById = async (req, res) => {
    try{
        const { id } = req.params;
        const level = await Level.findById(id);
        if(!level){
            return  res.status(404).json({ message: 'Level not found' });
        }
        res.status(200).json(level);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};

const updateLevelById = async (req, res) => {
    try{
        const { id } = req.params;
        const level = await Level.update(id, req.body);
        if(!level){
            return res.status(404).json({ message: 'Level not found' });
        }
        res.status(200).json(level);
    
    }catch(err){
        res.status(400).json({ message: err.message });
    }
};

const deleteLevelById = async (req, res) => {
    try{
        const { id } = req.params;
        const level = await Level.deleteById(id);
        if(!level){
            return res.status(404).json({ message: 'Level not found' });
        }
        res.status(200).json({ message: 'Level deleted successfully' });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};

const LevelController = {
    createLevel,
    getLevelsBySpecId,
    getLevelById,
    updateLevelById,
    deleteLevelById,
};

module.exports = LevelController;