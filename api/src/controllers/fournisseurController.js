const Fournisseur = require('../models/Fournisseur');  
  
// Créer un nouveau fournisseur  
exports.createFournisseur = async (req, res) => {  
  try {  
    const { code, nom, ice, rc, ville_rc, email, addresses } = req.body;  
      
    const fournisseur = new Fournisseur({  
      code,  
      nom,  
      ice,  
      rc,  
      ville_rc,  
      email,  
      addresses: addresses || []  
    });  
  
    await fournisseur.save();  
    res.status(201).json({ success: true, data: fournisseur });  
  } catch (error) {  
    res.status(400).json({ success: false, error: error.message });  
  }  
};  
  
// Récupérer tous les fournisseurs  
exports.getAllFournisseurs = async (req, res) => {  
  try {  
    const fournisseurs = await Fournisseur.find({ actif: true })  
      .populate('addresses')  
      .sort({ nom: 1 });  
    res.json({ success: true, data: fournisseurs });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
};  
  
// Récupérer un fournisseur par ID  
exports.getFournisseurById = async (req, res) => {  
  try {  
    const fournisseur = await Fournisseur.findById(req.params.id)  
      .populate('addresses');  
      
    if (!fournisseur) {  
      return res.status(404).json({ success: false, error: 'Fournisseur non trouvé' });  
    }  
      
    res.json({ success: true, data: fournisseur });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
};  
  
// Modifier un fournisseur  
exports.updateFournisseur = async (req, res) => {  
  try {  
    const fournisseur = await Fournisseur.findByIdAndUpdate(  
      req.params.id,  
      req.body,  
      { new: true, runValidators: true }  
    ).populate('addresses');  
      
    if (!fournisseur) {  
      return res.status(404).json({ success: false, error: 'Fournisseur non trouvé' });  
    }  
      
    res.json({ success: true, data: fournisseur });  
  } catch (error) {  
    res.status(400).json({ success: false, error: error.message });  
  }  
};  
  
// Supprimer un fournisseur (soft delete)  
exports.deleteFournisseur = async (req, res) => {  
  try {  
    const fournisseur = await Fournisseur.findByIdAndUpdate(  
      req.params.id,  
      { actif: false },  
      { new: true }  
    );  
      
    if (!fournisseur) {  
      return res.status(404).json({ success: false, error: 'Fournisseur non trouvé' });  
    }  
      
    res.json({ success: true, message: 'Fournisseur supprimé avec succès' });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
};