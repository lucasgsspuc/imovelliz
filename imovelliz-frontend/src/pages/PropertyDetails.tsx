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
  CardActions,
  Button,
  TextField,
  InputLabel,
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
import Property from '../components/Property';

// Corrige os ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Interface para os dados do imóvel
interface PropertyData {
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

const ContactSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  marginTop: theme.spacing(3),
}));

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

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

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar o formulário, por exemplo, uma chamada de API
    console.log('Formulário de contato enviado:', contactForm);
    // Resetar formulário após envio
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

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

  return (
    <>
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            <Grid size={12} key={property.id}>
              <Card>
                <Property property={property}></Property>
                <ContactSection>
                  <Typography variant="h5" gutterBottom>
                    Entre em Contato
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Interessado neste imóvel? Preencha o formulário abaixo para
                    mais informações.
                  </Typography>
                  <Box
                    component="form"
                    onSubmit={handleContactSubmit}
                    sx={{ mt: 2 }}
                  >
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <InputLabel htmlFor="name">Nome completo</InputLabel>
                        <TextField
                          fullWidth
                          hiddenLabel
                          name="name"
                          id="name"
                          value={contactForm.name}
                          onChange={handleContactChange}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <InputLabel htmlFor="email">E-mail</InputLabel>
                        <TextField
                          fullWidth
                          hiddenLabel
                          name="email"
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <InputLabel htmlFor="phone">Telefone</InputLabel>
                        <TextField
                          fullWidth
                          hiddenLabel
                          name="phone"
                          id="phone"
                          value={contactForm.phone}
                          onChange={handleContactChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <InputLabel htmlFor="message">Mensagem</InputLabel>
                        <TextField
                          fullWidth
                          name="message"
                          hiddenLabel
                          id="message"
                          rows={4}
                          value={contactForm.message}
                          onChange={handleContactChange}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2 }}
                        >
                          Enviar Mensagem
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </ContactSection>
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
                      <Marker
                        position={[property.latitude, property.longitude]}
                      >
                        <Popup>{property.title}</Popup>
                      </Marker>
                    </MapContainer>
                  </MapWrapper>
                )}
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default PropertyDetails;
