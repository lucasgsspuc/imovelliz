import {
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  ImageList,
  ImageListItem,
} from '@mui/material';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import DirectionsTransitOutlinedIcon from '@mui/icons-material/DirectionsTransitOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import StraightenIcon from '@mui/icons-material/Straighten';

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
  price: number; // Preço de aluguel
  salePrice?: number; // Preço de venda (opcional)
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

const Property: React.FC<{ property: Property }> = ({ property }) => {
  // Função srcset para otimizar o carregamento das imagens
  function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${
        size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }

  // Determina o layout dinâmico com base no número de fotos e posição
  const getColsAndRows = (index: number, totalPhotos: number) => {
    if (index === 0) return { cols: 5, rows: 2 };
    return { cols: 2, rows: 2 };
  };

  // Função para formatar o preço de forma elegante
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <CardContent>
      {/* Grid para Fotos e Detalhes */}
      <Grid container spacing={3}>
        {/* Lista de Fotos à Esquerda */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ImageList
            sx={{
              width: 500,
              height: property?.photos?.length > 0 ? 450 : 200,
            }}
            variant="quilted"
            cols={4}
            rowHeight={121}
          >
            {property.photos?.map((photo, index) => {
              const { cols, rows } = getColsAndRows(
                index,
                property.photos.length
              );
              return (
                <ImageListItem key={photo.url} cols={cols} rows={rows}>
                  <img
                    {...srcset(photo.url, 121, rows, cols)}
                    alt={`${property.title} - Foto ${index + 1}`}
                    loading="lazy"
                  />
                </ImageListItem>
              );
            })}
          </ImageList>
        </Grid>

        {/* Detalhes do Imóvel à Direita */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box display="flex" flexDirection="column" flexGrow={1} width="100%">
            {/* Título e Status */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Box>
                <Typography variant="h5" component="h1">
                  {property.title} com {property.area} m², {property.bedrooms}{' '}
                  quartos, {property.parkingSpaces} vagas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.address}, {property.city}, {property.state}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" width="100%" mb={4}>
              {property.salePrice && property.price ? (
                <>
                  <Typography variant="h6">
                    Aluguel: {formatPrice(property.price)}
                  </Typography>
                  {property.salePrice && (
                    <Typography variant="h6">
                      Venda: {formatPrice(property.salePrice)}
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  {property.price && (
                    <Typography variant="h6">
                      {formatPrice(property.price)}
                    </Typography>
                  )}
                  {property.salePrice && (
                    <Typography variant="h6">
                      {formatPrice(property.salePrice)}
                    </Typography>
                  )}
                </>
              )}
            </Box>

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
                  <Box display="flex" alignItems="center" minWidth="110px">
                    <StraightenIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">{property.area} m²</Typography>
                  </Box>
                )}
                {property.bedrooms && (
                  <Box display="flex" alignItems="center" minWidth="110px">
                    <BedOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">
                      {property.bedrooms} quartos
                    </Typography>
                  </Box>
                )}
                {property.bathrooms && (
                  <Box display="flex" alignItems="center" minWidth="110px">
                    <BathtubOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">
                      {property.bathrooms} banheiro
                      {property.bathrooms > 1 ? 's' : ''}
                    </Typography>
                  </Box>
                )}
                {property.parkingSpaces && (
                  <Box display="flex" alignItems="center" minWidth="110px">
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
                <Box display="flex" alignItems="center" minWidth="110px">
                  <PetsOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">Aceita pet</Typography>
                </Box>

                <Box display="flex" alignItems="center" minWidth="110px">
                  <DirectionsTransitOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">Não próx.</Typography>
                </Box>

                <Box display="flex" alignItems="center" minWidth="110px">
                  <BedOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    {property.furnished ? 'Mobiliado' : 'Sem mobília'}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" minWidth="110px">
                  <ApartmentOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">8° a 11° andar</Typography>
                </Box>
              </Box>
            </Box>

            {property.description && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" flexGrow={1}>
                  {property.description}
                </Typography>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default Property;
