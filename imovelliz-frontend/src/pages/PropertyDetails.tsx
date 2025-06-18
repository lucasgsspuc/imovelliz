import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import StraightenIcon from '@mui/icons-material/Straighten';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PropertyService } from '../services/PropertyService';
import Footer from '../components/Footer';
import AppAppBar from '../components/AppAppBar';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import DirectionsTransitOutlinedIcon from '@mui/icons-material/DirectionsTransitOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
// Corrige os ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Interface para os dados do imóvel
interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  type: 'APARTMENT' | 'HOUSE' | 'COMMERCIAL';
  status: 'AVAILABLE' | 'SOLD' | 'RENTED' | 'UNDER_REVIEW';
  price: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  description?: string;
  photos: { url: string; isMain: boolean }[];
  createdAt: string;
  updatedAt: string;
  furnished: boolean;
}

const MapWrapper = styled(Box)({
  height: '300px',
  borderRadius: '8px',
  overflow: 'hidden',
  marginTop: '16px',
});

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await PropertyService.getOne(id!);
        setProperty(response);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar os detalhes do imóvel');
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !property) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Imóvel não encontrado'}</Alert>
      </Container>
    );
  }

  function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${
        size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }

  const itemData = [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    },
    {
      img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
    },
    {
      img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
      title: 'Coffee',
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
      title: 'Hats',
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
      title: 'Honey',
      author: '@arwinneil',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
      title: 'Basketball',
    },
    {
      img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
      title: 'Fern',
    },
    {
      img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
      title: 'Mushrooms',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
      title: 'Tomato basil',
    },
    {
      img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
      title: 'Sea star',
    },
    {
      img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
      title: 'Bike',
      cols: 2,
    },
  ];

  return (
    <>
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <Container sx={{ mt: 4, mb: 8 }}>
          <Card>
            <CardContent>
              {/* Grid para Fotos e Detalhes */}
              <Grid container spacing={3}>
                {/* Lista de Fotos à Esquerda */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <ImageList
                    sx={{ width: 500, height: 450 }}
                    variant="quilted"
                    cols={4}
                    rowHeight={121}
                  >
                    {itemData.map((item) => (
                      <ImageListItem
                        key={item.img}
                        cols={item.cols || 1}
                        rows={item.rows || 1}
                      >
                        <img
                          {...srcset(item.img, 121, item.rows, item.cols)}
                          alt={item.title}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>

                {/* Detalhes do Imóvel à Direita */}

                <Grid
                  size={{ xs: 12, md: 6 }}
                  sx={{
                    height: '100%', // Ocupa toda a altura do contêiner pai
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    flexGrow={1} // Faz o Box interno crescer para ocupar o espaço disponível
                    width="100%"
                  >
                    {/* Título e Status */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={4}
                    >
                      <Box>
                        <Typography variant="h5" component="h1">
                          {property.title} com {property.area} m²,{' '}
                          {property.bedrooms} quartos, {property.parkingSpaces}{' '}
                          vagas
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {property.address}, {property.city}, {property.state}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="h6" mb={1}>
                      R$ {property.price.toLocaleString('pt-BR')}
                    </Typography>

                    <Box
                      display="flex"
                      flexDirection="column"
                      width="100%"
                      gap={2}
                      mb={2}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        flexWrap="wrap"
                        width="100%"
                      >
                        {property.area && (
                          <Box
                            display="flex"
                            alignItems="center"
                            minWidth="110px"
                          >
                            <StraightenIcon sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">
                              {property.area} m²
                            </Typography>
                          </Box>
                        )}
                        {property.bedrooms && (
                          <Box
                            display="flex"
                            alignItems="center"
                            minWidth="110px"
                          >
                            <BedOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">
                              {property.bedrooms} quartos
                            </Typography>
                          </Box>
                        )}
                        {property.bathrooms && (
                          <Box
                            display="flex"
                            alignItems="center"
                            minWidth="110px"
                          >
                            <BathtubOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">
                              {property.bathrooms} banheiro
                              {property.bathrooms > 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        )}
                        {property.parkingSpaces && (
                          <Box
                            display="flex"
                            alignItems="center"
                            minWidth="110px"
                          >
                            <DirectionsCarFilledOutlinedIcon
                              sx={{ mr: 1, fontSize: 20 }}
                            />
                            <Typography variant="body2">
                              {property.parkingSpaces} vaga
                              {property.parkingSpaces > 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        flexWrap="wrap"
                        width="100%"
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          minWidth="110px"
                        >
                          <PetsOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">Aceita pet</Typography>
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          minWidth="110px"
                        >
                          <DirectionsTransitOutlinedIcon
                            sx={{ mr: 1, fontSize: 20 }}
                          />
                          <Typography variant="body2">Não próx.</Typography>
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          minWidth="110px"
                        >
                          <BedOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">
                            {property.furnished ? 'Mobiliado' : 'Sem mobília'}
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          minWidth="110px"
                        >
                          <ApartmentOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">
                            8° a 11° andar
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {property.description && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          flexGrow={1}
                        >
                          Imóvel aconchegante para alugar com 2 quartos e 1
                          banheiro no total. O condomínio é bem equipado com
                          diversas instalações e fica localizado em Estrada do
                          Cafundá no bairro Tanque em Rio de Janeiro. Está bem
                          localizado, próximo a pontos de interesse de Tanque,
                          tais como Escola Municipal Maestro Lorenzo Fernandes,
                          Escola Municipal Noel Nutels, Creche Municipal Tia
                          Tereza, Praça Jauru, Hospital Curupaiti e Escola
                          Municipal Barão da Taquara.
                        </Typography>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {property.latitude && property.longitude && (
                <MapWrapper sx={{ mt: 3 }}>
                  <MapContainer
                    center={[property.latitude, property.longitude]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[property.latitude, property.longitude]}>
                      <Popup>{property.title}</Popup>
                    </Marker>
                  </MapContainer>
                </MapWrapper>
              )}
            </CardContent>
          </Card>
        </Container>
      </Container>

      <Footer />
    </>
  );
};

export default PropertyDetails;
