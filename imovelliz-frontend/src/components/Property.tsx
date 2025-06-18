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

const Property = ({ property }: any) => {
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

  function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${
        size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }

  return (
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
                  {property.title} com {property.area} m², {property.bedrooms}{' '}
                  quartos, {property.parkingSpaces} vagas
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
