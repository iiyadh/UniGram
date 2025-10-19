const { Departement } = require('../models/');

const createDepartement = async (req, res) => {
    const { name } = req.body;

    try{
        const result = await Departement.create({ name });
        console.log(result);
        res.status(200).json(result);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getDepartements = async (req, res) => {
    const departements =  await Departement.findAll();
    res.status(200).json(departements);
};

const getDepartementById = async (req, res) => {
    const { id } = req.params;
    try{
        const departement = await Departement.findById(id);
        res.status(200).json(departement);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
};

const updateDepartementById = async (req, res) => {
    const { id } = req.params;
    const { name , chef_id } = req.body;

    console.log(req.body);
    try{
        if(name === undefined){
            const updatedDepartement = await Departement.update(id, { chef_id });
            return res.status(200).json(updatedDepartement);
        }
        if(chef_id === undefined){
            const updatedDepartement = await Departement.update(id, { name });
            return res.status(200).json(updatedDepartement);
        }
        const updatedDepartement = await Departement.update(id, { name, chef_id });
        return res.status(200).json(updatedDepartement);
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteDepartementById = async (req, res) => {
    const { id } = req.params;
    try{
        const deletedDepartement = await Departement.deleteById(id);
        res.status(200).json(deletedDepartement);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DepartementController = {
    createDepartement,
    getDepartements,
    getDepartementById,
    updateDepartementById,
    deleteDepartementById
};

module.exports = DepartementController