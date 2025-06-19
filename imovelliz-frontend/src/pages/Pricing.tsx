import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';
import AppAppBar from '../components/AppAppBar';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  '&:hover': {
    boxShadow: (theme.vars || theme).shadows[4],
  },
}));

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  flexGrow: 1,
});

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Gratuito',
    price: 'R$ 0/mês',
    description:
      'Perfeito para explorar a plataforma e começar a busca por imóveis.',
    features: [
      'Listagens limitadas',
      'Busca básica por localização',
      'Suporte por e-mail',
    ],
    buttonText: 'Começar',
  },
  {
    name: 'Pro',
    price: 'R$ 49,90/mês',
    description: 'Ideal para corretores e investidores com mais recursos.',
    features: [
      'Listagens ilimitadas',
      'Busca avançada com filtros',
      'Avaliação de mercado',
      'Suporte prioritário',
    ],
    buttonText: 'Assinar',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: 'R$ 99,90/mês',
    description: 'Para profissionais que precisam de soluções completas.',
    features: [
      'Listagens ilimitadas',
      'Busca avançada com filtros personalizados',
      'Avaliação de mercado',
      'Suporte 24/7',
      'Relatórios avançados',
    ],
    buttonText: 'Assinar',
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanClick = (plan: Plan) => {
    if (!user && plan.name !== 'Gratuito') {
      navigate('/login');
    } else {
      // Lógica para assinar o plano (ex.: redirecionar para checkout)
      console.log(`Selecionado plano: ${plan.name}`);
    }
  };

  return (
    <>
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h1" gutterBottom>
              Escolha o plano ideal para sua jornada imobiliária
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explore nossos planos e encontre o que melhor se adapta às suas
              necessidades na Imovelliz.
            </Typography>
          </Box>
          <Grid container spacing={3} justifyContent="center">
            {plans.map((plan) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.name}>
                <StyledCard
                  sx={{
                    borderColor: plan.highlighted
                      ? (theme) => (theme.vars || theme).palette.primary.main
                      : undefined,
                    boxShadow: plan.highlighted
                      ? (theme) => (theme.vars || theme).shadows[6]
                      : undefined,
                  }}
                >
                  <StyledCardContent>
                    <Typography variant="h5" component="div">
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {plan.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {plan.description}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      {plan.features.map((feature, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                          • {feature}
                        </Typography>
                      ))}
                    </Box>
                    <Button
                      variant={plan.highlighted ? 'contained' : 'outlined'}
                      color="primary"
                      size="large"
                      fullWidth
                      style={{ marginBottom: 20 }}
                      onClick={() => handlePlanClick(plan)}
                    >
                      {plan.buttonText}
                    </Button>
                  </StyledCardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
