const BLFRS = require('../models/BL_FRS');  
const DepotEntryLine = require('../models/DepotEntryLine');  
  
// Créer un nouveau bon de livraison  
exports.createBLFRS = async (req, res) => {  
  try {  
    const {  
      fournisseur_id,  
      bl_date,  
      bl_reference,  
      depot_id,  
      entry_date,  
      livreur_employee_id,  
      magasin_employee_id,  
      commentaires,  
      lignes // Array des lignes de produits  
    } = req.body;  
  
    // Créer le bon de livraison  
    const blFrs = new BLFRS({  
      fournisseur_id,  
      bl_date,  
      bl_reference,  
      depot_id,  
      entry_date,  
      livreur_employee_id,  
      magasin_employee_id,  
      commentaires  
    });  
  
    // Gérer l'attachment si présent  
    if (req.file) {  
      blFrs.attachment = req.file.buffer;  
    }  
  
    await blFrs.save();  
  
    // Créer les lignes de produits  
    if (lignes && lignes.length > 0) {  
      const depotEntryLines = lignes.map(ligne => ({  
        ...ligne,  
        bl_frs_id: blFrs._id  
      }));  
        
      await DepotEntryLine.insertMany(depotEntryLines);  
    }  
  
    res.status(201).json({ success: true, data: blFrs });  
  } catch (error) {  
    res.status(400).json({ success: false, error: error.message });  
  }  
};  
  
// Récupérer tous les bons de livraison  
exports.getAllBLFRS = async (req, res) => {  
  try {  
    const { statut, fournisseur_id, depot_id } = req.query;  
      
    let filter = {};  
    if (statut) filter.statut = statut;  
    if (fournisseur_id) filter.fournisseur_id = fournisseur_id;  
    if (depot_id) filter.depot_id = depot_id;  
  
    const blFrsList = await BLFRS.find(filter)  
      .populate('fournisseur_id', 'nom code')  
      .populate('depot_id', 'nom code')  
      .populate('livreur_employee_id', 'nom prenom')  
      .populate('magasin_employee_id', 'nom prenom')  
      .sort({ bl_date: -1 });  
  
    res.json({ success: true, data: blFrsList });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
};  
  
// Récupérer un bon de livraison avec ses lignes  
exports.getBLFRSById = async (req, res) => {  
  try {  
    const blFrs = await BLFRS.findById(req.params.id)  
      .populate('fournisseur_id')  
      .populate('depot_id')  
      .populate('livreur_employee_id')  
      .populate('magasin_employee_id');  
      
    if (!blFrs) {  
      return res.status(404).json({ success: false, error: 'Bon de livraison non trouvé' });  
    }  
  
    // Récupérer les lignes associées  
    const lignes = await DepotEntryLine.find({ bl_frs_id: req.params.id })  
      .populate('product_id')  
      .populate('um_id');  
  
    res.json({ success: true, data: { ...blFrs.toObject(), lignes } });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
};  
  
// Valider un bon de livraison  
exports.validateBLFRS = async (req, res) => {  
  try {  
    const blFrs = await BLFRS.findByIdAndUpdate(  
      req.params.id,  
      { statut: 'VALIDE' },  
      { new: true }  
    );  
      
    if (!blFrs) {  
      return res.status(404).json({ success: false, error: 'Bon de livraison non trouvé' });  
    }  
      
    res.json({ success: true, data: blFrs });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
};  
  
// Supprimer un bon de livraison  
exports.deleteBLFRS = async (req, res) => {  
  try {  
    // Supprimer les lignes associées  
    await DepotEntryLine.deleteMany({ bl_frs_id: req.params.id });  
      
    // Supprimer le bon de livraison  
    const blFrs = await BLFRS.findByIdAndDelete(req.params.id);  
      
    if (!blFrs) {  
      return res.status(404).json({ success: false, error: 'Bon de livraison non trouvé' });  
    }  
      
    res.json({ success: true, message: 'Bon de livraison supprimé avec succès' });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
};