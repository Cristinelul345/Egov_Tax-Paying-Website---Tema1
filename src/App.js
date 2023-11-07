import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import jsPDF from 'jspdf';

function App() {
  const [formData, setFormData] = useState({
    institution: '',
    cnp_1: '',
    cnp_2: '',
    nume_pren: '',
    addr: '',
    email: '',
    message: ''
  });
  const [selectedJudet, setSelectedJudet] = useState('');
  const [selectedInstitutie, setSelectedInstitutie] = useState('');
  const [totalSum, setTotalSum] = useState(0);
  const judetOptions = ['Alba Iulia', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brăila',
    'Brașov', 'Buzău', 'Călărași', ' Caraș-Severin', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați',
    'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș', 'Mehedinți', 'Mureș', 'Neamț',
    'Olt', 'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea'];
  const institutieOptions = {
    'Alba Iulia': ['Abrud', 'Aiud', 'Alba Iulia'],
    'Arad': ['Apateu', 'Arad', 'Archis'],
    'Argeș': ['Albestii de Muscel', 'Albota', 'Arfeu'],
    'Bacău': ['Asau', 'Bacau', 'Balcani'],
    'Bihor': ['Alesd', 'Bratca', 'Cabesti'],
    'Bistrița-Năsăud': ['Beclean', 'Bistrita', 'Budacu de Jos'],
    'Botoșani': ['Albesti', 'Botosani', 'Bucecea'],
    'Brăila': ['Braila', 'Faureni', 'Gropeni'],
    'Brașov': ['Beclean', 'Bod', 'Bran'],
    'Buzău': ['Braesti', 'Breaza', 'Buda'],
    'Călărași': ['Cuza Voda', 'Calarasi', 'Dichiseni'],
    'Caraș-Severin': ['Anina', 'Baile Herculane', 'Bocsa'],
    'Cluj': ['Aghiresu', 'Aiton', 'Apahida'],
    'Constanța': ['23 August', 'Agigea', 'Albesti'],
    'Covasna': ['Arcus', 'Baraolt', 'Baracani'],
    'Dâmbovița': ['Aninoasa', 'Bezdead', 'Bilciuresti'],
    'Dolj': ['Bailesti', 'Barca', 'Bechet'],
    'Galați': ['Baleni', 'Barcea', 'Beresti-Meria'],
    'Giurgiu': ['Adunati Copaceni', 'Bolintin Deal', 'Bolintin Vale'],
    'Gorj': ['Arcani', 'Baia de fier', 'Balesti'],
    'Harghita': ['Atid', 'Avramesti', 'Baile Tusnad'],
    'Hunedoara': ['Aninoasa', 'Bacia', 'Brad'],
    'Ialomița': ['Adancata', 'Amara', 'Barcanesti'],
    'Iași': ['Aroneanu', 'Barnova', 'Butea'],
  };

  const handleCountyChange = (e) => {
    const selectedJudetValue = e.target.value;
    setSelectedJudet(selectedJudetValue);

    // Clear the selected "Institutie" when the "Judet" changes
    setSelectedInstitutie('');
  };

  const handleInstitutieChange = (e) => {
    setSelectedInstitutie(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSumChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Create an object to send in the POST request body
    const requestBody = {
      suma: value,
    };

    // Send a POST request with the 'fetch' API
    fetch('http://localhost:5000/api/tax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response JSON
      })
      .then((data) => {
        console.log('Response from server:', data);
        setTotalSum(data['suma']);
        // Handle the response data as needed
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle the error
      });
  };

  // const [totalSum, setTotalSum] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    const doc = new jsPDF();
    doc.text(`Totalul de plata va fi ${totalSum}`, 10, 10);

    const jsonData = convertDataToJSON({
      ...formData,
      total: totalSum
    });

    fetch('http://localhost:5000/api/save-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('JSON data saved successfully');
      })
      .catch((error) => {
        console.error('Error saving JSON data:', error);
        // Handle the error
      });

    // Trigger the download
    doc.save('my-pdf-document.pdf');
  };

  
  function convertDataToJSON(data) {
    return JSON.stringify(data, null, 2);
  }
  
  // Define styles for the PDF document using StyleSheet.create
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 100,
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
    },
    sum: {
      fontSize: 20,
    },
  });



  return (

    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="selectJudet" className="form-label">Judet:</label>
          <select
            id="selectJudet"
            className="form-control"
            value={selectedJudet}
            onChange={handleCountyChange}
          >
            <option value="">Select a Judet</option>
            {judetOptions.map((judet) => (
              <option key={judet} value={judet}>
                {judet}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="selectInstitutie" className="form-label">Institutie:</label>
          <select
            id="selectInstitutie"
            className="form-control"
            value={selectedInstitutie}
            onChange={handleInstitutieChange}
          >
            <option value="">Select an Institutie</option>
            {institutieOptions[selectedJudet]?.map((institutie) => (
              <option key={institutie} value={institutie}>
                {institutie}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="selectInstitutie" className="form-label">Persoana jurudica:</label>
          <select id="selectInstitutie" className="form-control">
            <option value="option1">Persoana fizica</option>
            <option value="option2">Persoana juridica</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Suma
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.sum}
            onChange={handleSumChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cnp_1" className="form-label">
            CNP al persoanei care face plata
          </label>
          <input
            type="text"
            className="form-control"
            id="cnp_1"
            name="cnp_1"
            value={formData.cnp_1}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cnp_2" className="form-label">
            CNP al persoanei pentru care se face plata
          </label>
          <input
            type="text"
            className="form-control"
            id="cnp_2"
            name="cnp_2"
            value={formData.cnp_2}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="nume_pren" className="form-label">
            Nume si Prenume
          </label>
          <input
            type="text"
            className="form-control"
            id="nume_pren"
            name="nume_pren"
            value={formData.nume_pren}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="addr" className="form-label">
            Adresa Postala
          </label>
          <input
            type="text"
            className="form-control"
            id="addr"
            name="addr"
            value={formData.addr}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
          />
        </div>
        {totalSum > 0 && <p>Totalul de plata va fi {totalSum}</p>}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
