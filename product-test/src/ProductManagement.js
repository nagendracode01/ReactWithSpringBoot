import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';



const ProductManagement = () => {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [date, setDate] = useState('');
  const [stateCode, setstateCode] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Number of products per page

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleBack = () => {
    setSelectedProduct(null);
  };

  const handleRefresh = () => {
    setProductId('');
    setProductName('');
    setDate('');
    setstateCode('');
    setProducts([]);
    setSelectedProduct(null);
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setEditMode(false);
    setSaveSuccessMessage('');
    setSaveErrorMessage('');
    setCurrentPage(1);
  };


  // This useEffect hook will show the modal when the respective message is set
  useEffect(() => {
    if (saveSuccessMessage) {
      setShowSuccessModal(true);
    }
    if (saveErrorMessage) {
      setShowErrorModal(true);
    }
  }, [saveSuccessMessage, saveErrorMessage]);

  // This function is called when the "Close" button inside the success modal is clicked
  const handleCloseSuccessModal = () => setShowSuccessModal(false);

  // This function is called when the "Close" button inside the error modal is clicked
  const handleCloseErrorModal = () => setShowErrorModal(false);

  



  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchProducts();
    setSaveSuccessMessage(''); // Clear success message
    setSaveErrorMessage('');   // Clear error message
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/product/get?productId=${productId}&productName=${productName}&date=${date}&stateCode=${stateCode}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleDoubleClick = (product) => {
    setSelectedProduct(product);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleUpdate = async () => {
    try {
      const newProduct = {
        productId: selectedProduct.productId, // Keep the same ID
        productName: selectedProduct.productName,
        date: selectedProduct.date,
        stateCode: selectedProduct.stateCode,
      };
  
      const response = await fetch(`http://localhost:8080/product/saveData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct), // Send the new product data
      });
  
      if (response.ok) {
        setProducts([...products, newProduct]); // Add the new product to the products array
        setSelectedProduct(null);
        setEditMode(false);
        setSaveSuccessMessage('Data saved successfully.');
        setSaveErrorMessage('');
      } else {
        const errorData = await response.json();
        setSaveErrorMessage(`Error inserting data: ${errorData.message}`);
        setSaveSuccessMessage('');
      }
    } catch (error) {
      setSaveErrorMessage('An error occurred while inserting data.');
      setSaveSuccessMessage('');
      console.error('Error inserting data:', error);
    }
  
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={4}>
          <h2>Add a New Product</h2>
          <Button variant="secondary" onClick={handleRefresh}>Clear</Button>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Form.Group>
              <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="duedate"
                placeholder="Due date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
  <Form.Label>State Code</Form.Label>
  <Form.Control
    as="select"
    value={stateCode}
    onChange={(e) => setstateCode(e.target.value)}
  >
    <option value="">Select a State Code</option>
    <option value="AZ">AZ</option>
    <option value="CM">CM</option>
    <option value="SF">SF</option>
  </Form.Control>
</Form.Group>


            <Button type="submit" variant="primary">Product Catalog</Button>
          </Form>
        </Col>
        <Col md={8}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            selectedProduct ? (
              <div>
                <h2>Product Details</h2>
                <Button onClick={handleBack}>Back</Button>
                <Form>
                  <Form.Group controlId="productId">
                    <Form.Label>Product ID</Form.Label>
                    <Form.Control
                      disabled={!editMode}
                      value={selectedProduct.productId}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          productId: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="productName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      disabled={!editMode}
                      value={selectedProduct.productName}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          productName: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="productDate">
                    <Form.Label>Product Date</Form.Label>
                    <Form.Control
                      disabled={!editMode}
                      type='date'
                      value={selectedProduct.date}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          date: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="productStateCode">
                    <Form.Label>State Code</Form.Label>
                    <Form.Control
                    disabled={!editMode}
      as="select"
      value={selectedProduct.stateCode}
      onChange={(e) =>
        setSelectedProduct({
          ...selectedProduct,
          stateCode: e.target.value,
        })
      }
    >
      <option value="AZ">AZ</option>
      <option value="CM">CM</option>
      <option value="SF">SF</option>
    </Form.Control>
                  </Form.Group>

                  

                  
                  {editMode ? (
                    <div>
                      <Button variant="success" onClick={handleUpdate}>
                        Save
                      </Button>
                       <Button onClick={() => setEditMode(false)}>Cancel</Button>
                    </div>
                  ) : (
                    <Button onClick={handleEdit}>Edit</Button>
                  )}
                </Form>
              </div>
            ) : (
              <div>
                <h2>Product List</h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th>Date</th>
                      <th>StateCode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product) => (
                      <tr
                        key={product.id}
                        onDoubleClick={() => handleDoubleClick(product)}
                      >
                        <td>{product.productId}</td>
                        <td>{product.productName}</td>
                        <td>{product.date}</td>
                        <td>{product.stateCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination>
                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                  {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={currentPage === Math.ceil(products.length / productsPerPage) || products.length === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </Pagination>
              </div>
            )
          )}
          <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
            <Modal.Header closeButton>
              <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>{saveSuccessMessage}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseSuccessModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
            <Modal.Header closeButton>
              <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>{saveErrorMessage}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseErrorModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductManagement;
