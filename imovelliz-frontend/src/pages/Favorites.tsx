import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActions,
  Box,
  IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import Footer from '../components/Footer';
import AppAppBar from '../components/AppAppBar';
import Property from '../components/Property';

// Dados simulados de imóveis favoritados
const mockFavorites = [
  {
    id: 1,
    title: 'Apartamento Moderno no Centro',
    price: 850000,
    type: 'apartamento',
    address: 'Rua Principal, 123',
    city: 'São Paulo',
    state: 'SP',
    area: 80,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 2,
    title: 'Casa Espaçosa na Zona Sul',
    price: 1200000,
    type: 'casa',
    address: 'Avenida Sul, 456',
    city: 'Rio de Janeiro',
    state: 'RJ',
    area: 150,
    bedrooms: 3,
    bathrooms: 3,
    image: 'https://via.placeholder.com/300x200',
  },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState(mockFavorites);

  const handleRemoveFavorite = (id: any) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Meus Favoritos
          </Typography>
          {favorites.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Você ainda não cadastrou nenhum imóvel.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {favorites.map((property: any) => (
                <Grid size={12} key={property.id}>
                  <Card>
                    <Property property={property}></Property>
                    <CardActions sx={{ justifyContent: 'end' }}>
                      <Box>
                        <IconButton
                          color="error"
                          style={{ marginLeft: 8 }}
                          onClick={() => {}}
                          aria-label="Remover imóvel"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Container>

      <Footer />
    </>
  );
};

export default Favorites;
