import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActions,
  Box,
  IconButton,
  CardMedia,
  CardContent,
  styled,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import Footer from '../components/Footer';
import AppAppBar from '../components/AppAppBar';
import Property from '../components/Property';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import StraightenIcon from '@mui/icons-material/Straighten';
import { PropertyService } from '../services/PropertyService';
import { useNavigate } from 'react-router-dom';
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(price);
};

const SyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const SyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const Favorites = () => {
  const [favorites, setFavorites] = useState<any>([]);
  const navigate = useNavigate();

  const handleShowFavorites = async () => {
    try {
      const data = await PropertyService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
    }
  };

  useEffect(() => {
    handleShowFavorites();
  }, []);

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
                Você ainda não possui nenhum imóvel favoritado.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {favorites.map(({ property }: any) => (
                <Grid
                  size={{ xs: 12, md: 4 }}
                  key={property.id}
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <SyledCard variant="outlined" tabIndex={0}>
                    <CardMedia
                      component="img"
                      image={property.photos[0].url}
                      sx={{
                        aspectRatio: '16 / 9',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <SyledCardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <Typography variant="h6">
                          {property.salePrice
                            ? formatPrice(property.salePrice)
                            : formatPrice(property.price)}
                        </Typography>
                        <Box
                          onClick={async (e) => {
                            e.stopPropagation(); // para não ativar o clique no card
                            await PropertyService.deleteFavorite(property.id);
                            await handleShowFavorites();
                          }}
                          sx={{ cursor: 'pointer' }}
                        >
                          <Delete />
                        </Box>
                      </Box>

                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="div"
                      >
                        {property.city}, {property.state}
                      </Typography>
                      <StyledTypography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {property.description}
                      </StyledTypography>
                      <Box display="flex" gap={3}>
                        {property.area && (
                          <Box display="flex" alignItems="center">
                            <StraightenIcon sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">
                              {property.area} m²
                            </Typography>
                          </Box>
                        )}
                        {property.bedrooms && (
                          <Box display="flex" alignItems="center">
                            <BedOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">
                              {property.bedrooms}
                            </Typography>
                          </Box>
                        )}
                        {property.bathrooms && (
                          <Box display="flex" alignItems="center">
                            <BathtubOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">
                              {property.bathrooms}
                            </Typography>
                          </Box>
                        )}
                        {property.parkingSpaces && (
                          <Box display="flex" alignItems="center">
                            <DirectionsCarFilledOutlinedIcon
                              sx={{ mr: 1, fontSize: 20 }}
                            />
                            <Typography variant="body2">
                              {property.parkingSpaces}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </SyledCardContent>
                  </SyledCard>
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
