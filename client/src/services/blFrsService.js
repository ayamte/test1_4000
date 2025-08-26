import axios from 'axios';  
  
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';  
  
class BLFRSService {  
  // Créer un nouveau bon de livraison avec fichier  
  async createBLFRS(blFrsData, attachmentFile = null) {  
    try {  
      const formData = new FormData();  
        
      // Ajouter les données du bon de livraison  
      Object.keys(blFrsData).forEach(key => {  
        if (key === 'lignes') {  
          formData.append(key, JSON.stringify(blFrsData[key]));  
        } else {  
          formData.append(key, blFrsData[key]);  
        }  
      });  
  
      // Ajouter le fichier si présent  
      if (attachmentFile) {  
        formData.append('attachment', attachmentFile);  
      }  
  
      const response = await axios.post(`${API_BASE_URL}/bl-frs`, formData, {  
        headers: {  
          'Content-Type': 'multipart/form-data',  
        },  
      });  
      return response.data;  
    } catch (error) {  
      throw this.handleError(error);  
    }  
  }  
  
  // Récupérer tous les bons de livraison avec filtres  
  async getAllBLFRS(filters = {}) {  
    try {  
      const params = new URLSearchParams();  
      if (filters.statut) params.append('statut', filters.statut);  
      if (filters.fournisseur_id) params.append('fournisseur_id', filters.fournisseur_id);  
      if (filters.depot_id) params.append('depot_id', filters.depot_id);  
  
      const response = await axios.get(`${API_BASE_URL}/bl-frs?${params.toString()}`);  
      return response.data;  
    } catch (error) {  
      throw this.handleError(error);  
    }  
  }  
  
  // Récupérer un bon de livraison avec ses lignes  
  async getBLFRSById(id) {  
    try {  
      const response = await axios.get(`${API_BASE_URL}/bl-frs/${id}`);  
      return response.data;  
    } catch (error) {  
      throw this.handleError(error);  
    }  
  }  
  
  // Valider un bon de livraison  
  async validateBLFRS(id) {  
    try {  
      const response = await axios.put(`${API_BASE_URL}/bl-frs/${id}/validate`);  
      return response.data;  
    } catch (error) {  
      throw this.handleError(error);  
    }  
  }  
  
  // Supprimer un bon de livraison  
  async deleteBLFRS(id) {  
    try {  
      const response = await axios.delete(`${API_BASE_URL}/bl-frs/${id}`);  
      return response.data;  
    } catch (error) {  
      throw this.handleError(error);  
    }  
  }  
  
  // Gestion des erreurs  
  handleError(error) {  
    if (error.response) {  
      return {  
        success: false,  
        error: error.response.data.error || 'Erreur serveur',  
        status: error.response.status  
      };  
    } else if (error.request) {  
      return {  
        success: false,  
        error: 'Erreur de connexion au serveur',  
        status: 0  
      };  
    } else {  
      return {  
        success: false,  
        error: error.message,  
        status: 0  
      };  
    }  
  }  
}  
  
export default new BLFRSService();