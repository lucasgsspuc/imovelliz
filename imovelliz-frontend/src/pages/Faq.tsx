import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
  padding: theme.spacing(2),
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'O que é a Imovelliz?',
    answer:
      'A Imovelliz é uma plataforma moderna para compra, venda e aluguel de imóveis, com ferramentas como busca personalizada, avaliações de mercado e suporte dedicado.',
  },
  {
    question: 'Como posso me cadastrar na Imovelliz?',
    answer:
      'Acesse nosso site ou aplicativo, clique em "Criar Conta" e preencha seus dados. A verificação é feita por e-mail ou telefone.',
  },
  {
    question: 'Quais são as funcionalidades principais?',
    answer:
      'Oferecemos busca por filtros (localização, preço), integração com mapas, gestão de favoritos e avaliações de propriedades.',
  },
  {
    question: 'Como entrar em contato com o suporte?',
    answer:
      'Nosso suporte está disponível 24/7 via chat no app, e-mail (suporte@imovelliz.com) ou telefone (+55 11 1234-5678).',
  },
  {
    question: 'Posso cancelar meu plano a qualquer momento?',
    answer:
      'Sim, você pode cancelar pelo painel de controle a qualquer momento, com o plano ativo até o fim do ciclo de faturamento.',
  },
];

export default function FAQ() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
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
              Perguntas Frequentes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Encontre respostas para as dúvidas mais comuns sobre a Imovelliz.
            </Typography>
          </Box>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {faqs.map((faq, index) => (
              <StyledAccordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
              >
                <StyledAccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography variant="h6">{faq.question}</Typography>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </StyledAccordionDetails>
              </StyledAccordion>
            ))}
          </Box>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
