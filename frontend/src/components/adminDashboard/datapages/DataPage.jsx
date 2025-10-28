import React, { useState } from 'react';
import ContactsDataPage from './ContactsDataPage';
import DemosDataPage from './DemosDataPage';


const DataPage = () => {
  const [activeTab, setActiveTab] = useState('contacts');

  return (
  
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="py-4">
              <h1 className="text-center mb-4">Data Management Dashboard</h1>
              
              <div className="d-flex justify-content-center mb-4">
                <div className="btn-group" role="group" aria-label="Data toggle">
                  <button
                    type="button"
                    className={`btn btn-lg ${activeTab === 'contacts' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('contacts')}
                  >
                    Contacts
                  </button>
                  <button
                    type="button"
                    className={`btn btn-lg ${activeTab === 'demos' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('demos')}
                  >
                    Demos
                  </button>
                </div>
              </div>

              <div className="tab-content">
                {activeTab === 'contacts' && <ContactsDataPage />}
                {activeTab === 'demos' && <DemosDataPage />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 
  );
};

export default DataPage;
