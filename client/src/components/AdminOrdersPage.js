// src/components/AdminOrdersPage.js
import React, { useEffect, useState } from 'react';
import { Table, Container, Header, Loader, Message } from 'semantic-ui-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/orders`
        );
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader active inline="centered" />;
  if (error)   return <Message error header="Error" content={error} />;

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Header as="h2">All Orders</Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Order ID</Table.HeaderCell>
            <Table.HeaderCell>User ID</Table.HeaderCell>
            <Table.HeaderCell>Items</Table.HeaderCell>
            <Table.HeaderCell>Total (USD)</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orders.map(o => (
            <Table.Row key={o._id}>
              <Table.Cell>{o._id}</Table.Cell>
              <Table.Cell>{o.user}</Table.Cell>
              <Table.Cell>
                {o.items.map(i => `${i.name}×${i.quantity}`).join(', ')}
              </Table.Cell>
              <Table.Cell>${o.total.toFixed(2)}</Table.Cell>
              <Table.Cell>{new Date(o.createdAt).toLocaleString()}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
}
