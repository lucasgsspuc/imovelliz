import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Button } from '@mui/material';
import { PropertyService } from '../services/PropertyService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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

function priceFormatter(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export function Search() {
  return (
    <FormControl sx={{ width: { xs: '100%', md: '35ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Buscar imóveis..."
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </FormControl>
  );
}

export default function MainContent() {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null
  );
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = React.useState<any[]>([]);

  const handleShowProperties = async () => {
    try {
      const data = await PropertyService.home();
      setProperties(data);
    } catch (error) {}
  };

  React.useEffect(() => {
    handleShowProperties();
  }, []);

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleClick = () => {
    console.info('You clicked the filter chip.');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="20vh"
      >
        <Typography variant="h1" gutterBottom>
          O lar que você sonha está a um clique
        </Typography>
        <Typography>
          Encontre imóveis que combinam com seu estilo de vida — com
          localização, conforto e praticidade para viver seus planos com
          tranquilidade.
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} mt={4}>
          <Search />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'row',
            gap: 3,
            overflow: 'auto',
          }}
        >
          <Chip onClick={handleClick} size="medium" label="Novidades" />
          <Chip
            onClick={handleClick}
            size="medium"
            label="3 Quartos"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
          <Chip
            onClick={handleClick}
            size="medium"
            label="A partir de 50m²"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
          <Chip
            onClick={handleClick}
            size="medium"
            label="2 Banheiros"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
        </Box>
      </Box>
      <Grid container spacing={2} columns={12}>
        {properties?.map((property) => (
          <Grid size={{ xs: 12, md: 4 }} key={property.id}>
            <SyledCard
              variant="outlined"
              onFocus={() => handleFocus(0)}
              onBlur={handleBlur}
              onClick={() => {
                if (user) navigate(`/property/${property.id}`);
                else navigate('/login');
              }}
              tabIndex={0}
              className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
            >
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
                <Typography variant="h6">
                  {priceFormatter(property.price)}
                </Typography>

                <Typography gutterBottom variant="subtitle1" component="div">
                  {property.address}
                </Typography>
                <StyledTypography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  {property.description}
                </StyledTypography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margintop: '10px',
                    padding: '8px',
                  }}
                >
                  <Typography variant="body2">{property.area} m²</Typography>
                  <Typography variant="body2">
                    {property.parkingSpaces} vagas
                  </Typography>
                  <Typography variant="body2">
                    {property.bedrooms} quartos
                  </Typography>
                </Box>
              </SyledCardContent>
            </SyledCard>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            if (user) console.log('Ver mais');
            else navigate('/login');
          }}
        >
          Ver mais
        </Button>
      </Box>
    </Box>
  );
}
