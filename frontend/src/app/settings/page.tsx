'use client'

import styled from 'styled-components'
import AppLayout from '@/components/templates/AppLayout/AppLayout'
import { theme } from '@/styles/theme'
import Button from '@/components/atoms/Button/Button'
import {
  BellRing,
  Database,
  Globe,
  Lock,
  ShieldCheck,
  SlidersHorizontal,
  Tractor,
  Workflow,
} from 'lucide-react'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`

const Header = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.02em;
`

const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  max-width: 720px;
`

const HeroCard = styled.section`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%);
  border-radius: ${theme.radii.xl};
  color: #fff;
  box-shadow: ${theme.shadows.md};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const HeroLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.8;
`

const HeroTitle = styled.h2`
  font-size: 26px;
  font-weight: 900;
  line-height: 1.1;
`

const HeroDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.9;
`

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
`

const HeroStat = styled.div`
  padding: 16px;
  border-radius: ${theme.radii.lg};
  background-color: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
`

const HeroStatLabel = styled.div`
  font-size: 11px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

const HeroStatValue = styled.strong`
  display: block;
  margin-top: 6px;
  font-size: 22px;
  font-weight: 900;
`

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const Panel = styled.article`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.xl};
  padding: 22px;
  box-shadow: ${theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const PanelIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: ${theme.radii.md};
  background-color: ${theme.colors.primaryXLight};
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.2;
  }
`

const PanelTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
`

const PanelDescription = styled.p`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
`

const SettingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`

const SettingText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const SettingName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`

const SettingHint = styled.span`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
`

const StatusPill = styled.span<{ $variant?: 'success' | 'warning' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  padding: 7px 10px;
  border-radius: ${theme.radii.full};
  font-size: 12px;
  font-weight: 700;
  background-color: ${({ $variant }) => ($variant === 'warning' ? '#fff7e8' : '#ecfdf3')};
  color: ${({ $variant }) => ($variant === 'warning' ? theme.colors.warning : theme.colors.success)};
`

const Switch = styled.button<{ $enabled?: boolean }>`
  width: 52px;
  height: 30px;
  border: none;
  border-radius: 999px;
  background-color: ${({ $enabled }) => ($enabled ? theme.colors.primary : theme.colors.border)};
  position: relative;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: 4px;
    left: ${({ $enabled }) => ($enabled ? '26px' : '4px')};
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: #fff;
    transition: left 0.2s ease;
  }
`

export default function SettingsPage() {
  return (
    <AppLayout>
      <PageContainer>
        <Header>
          <TitleBlock>
            <Title>Configurações</Title>
            <Subtitle>
              Configure o espaço de trabalho, alertas operacionais, políticas de segurança e padrões do painel para o ambiente Brain Agriculture.
            </Subtitle>
          </TitleBlock>
          <Button variant="primary">
            <ShieldCheck size={16} />
            Salvar Preferências
          </Button>
        </Header>

        <HeroCard>
          <HeroText>
            <HeroLabel>Controle do Espaço de Trabalho</HeroLabel>
            <HeroTitle>Preferências operacionais para seu centro de comando agrícola</HeroTitle>
            <HeroDescription>
              Esta página centraliza notificações de usuários, cadência de atualização de dados, verificação de segurança e saúde de integração para que o time mantenha a plataforma de gestão previsível e auditável.
            </HeroDescription>
          </HeroText>

          <HeroStats>
            <HeroStat>
              <HeroStatLabel>Ambiente</HeroStatLabel>
              <HeroStatValue>Produção</HeroStatValue>
            </HeroStat>
            <HeroStat>
              <HeroStatLabel>Cadência de sincronização</HeroStatLabel>
              <HeroStatValue>15 min</HeroStatValue>
            </HeroStat>
            <HeroStat>
              <HeroStatLabel>Nível de Segurança</HeroStatLabel>
              <HeroStatValue>Rigoroso</HeroStatValue>
            </HeroStat>
            <HeroStat>
              <HeroStatLabel>Módulos online</HeroStatLabel>
              <HeroStatValue>7 / 8</HeroStatValue>
            </HeroStat>
          </HeroStats>
        </HeroCard>

        <Grid>
          <Panel>
            <PanelHeader>
              <PanelIcon>
                <BellRing />
              </PanelIcon>
              <div>
                <PanelTitle>Notificações</PanelTitle>
                <PanelDescription>Controle como e quando a plataforma notifica seu time.</PanelDescription>
              </div>
            </PanelHeader>
            <SettingList>
              <SettingRow>
                <SettingText>
                  <SettingName>Alertas de operação crítica</SettingName>
                  <SettingHint>Notifique quando as atualizações de produtor ou propriedade falharem na validação.</SettingHint>
                </SettingText>
                <Switch $enabled aria-label="Alertas de operação crítica habilitados" />
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingName>Resumo executivo diário</SettingName>
                  <SettingHint>Resuma indicadores do painel todas as manhãs.</SettingHint>
                </SettingText>
                <Switch $enabled aria-label="Resumo executivo diário habilitado" />
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingName>Horas silenciosas</SettingName>
                  <SettingHint>Suprima alertas de baixa prioridade fora do horário comercial.</SettingHint>
                </SettingText>
                <StatusPill $variant="warning">22:00 - 06:00</StatusPill>
              </SettingRow>
            </SettingList>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelIcon>
                <Lock />
              </PanelIcon>
              <div>
                <PanelTitle>Segurança</PanelTitle>
                <PanelDescription>Revise proteções de acesso e regras de governança de dados.</PanelDescription>
              </div>
            </PanelHeader>
            <SettingList>
              <SettingRow>
                <SettingText>
                  <SettingName>Aplicação obrigatória de dois fatores</SettingName>
                  <SettingHint>Exija MFA para todos os usuários administrativos.</SettingHint>
                </SettingText>
                <StatusPill>Habilitado</StatusPill>
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingName>Expiração de sessão</SettingName>
                  <SettingHint>Faça logout automático de sessões inativas.</SettingHint>
                </SettingText>
                <StatusPill $variant="warning">30 min</StatusPill>
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingName>Retenção de trilha de auditoria</SettingName>
                  <SettingHint>Mantenha eventos operacionais disponíveis para revisão de conformidade.</SettingHint>
                </SettingText>
                <StatusPill>180 dias</StatusPill>
              </SettingRow>
            </SettingList>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelIcon>
                <SlidersHorizontal />
              </PanelIcon>
              <div>
                <PanelTitle>Padrões do Painel</PanelTitle>
                <PanelDescription>Escolha o comportamento de base para análises e resumos.</PanelDescription>
              </div>
            </PanelHeader>
            <SettingList>
              <SettingRow>
                <SettingText>
                  <SettingName>Atualização automática de análises</SettingName>
                  <SettingHint>Atualize gráficos agregados periodicamente.</SettingHint>
                </SettingText>
                <Switch $enabled aria-label="Atualização automática de análises habilitada" />
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingName>Escopo geográfico padrão</SettingName>
                  <SettingHint>Abra painéis com dados de todo o país selecionados.</SettingHint>
                </SettingText>
                <StatusPill>Brasil</StatusPill>
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingName>Blocos de tendência comparativa</SettingName>
                  <SettingHint>Exiba deltas mensais nos cartões de visão geral.</SettingHint>
                </SettingText>
                <Switch $enabled aria-label="Blocos de tendência comparativa habilitados" />
              </SettingRow>
            </SettingList>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelIcon>
                <Workflow />
              </PanelIcon>
              <div>
                <PanelTitle>Integrações</PanelTitle>
                <PanelDescription>Monitore dependências de plataforma e serviços externos.</PanelDescription>
              </div>
            </PanelHeader>
            <SettingList>
              <SettingRow>
                <SettingText>
                  <SettingName>Gateway de API</SettingName>
                  <SettingHint>Roteamento de back-end primário para produtor, propriedade e dados do painel.</SettingHint>
                </SettingText>
                <StatusPill>Saudável</StatusPill>
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingName>Replicação de banco de dados</SettingName>
                  <SettingHint>Replicação assíncrona usada para cargas de trabalho de relatórios.</SettingHint>
                </SettingText>
                <StatusPill $variant="warning">Atraso 4 min</StatusPill>
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingName>Telemetria regional</SettingName>
                  <SettingHint>Métricas agrícolas recebidas de módulos conectados.</SettingHint>
                </SettingText>
                <StatusPill>Online</StatusPill>
              </SettingRow>
            </SettingList>
          </Panel>
        </Grid>

        <Grid>
          <Panel>
            <PanelHeader>
              <PanelIcon>
                <Database />
              </PanelIcon>
              <div>
                <PanelTitle>Política de Dados</PanelTitle>
                <PanelDescription>Governe como a plataforma armazena e expõe registros agrícolas.</PanelDescription>
              </div>
            </PanelHeader>
            <SettingList>
              <SettingRow>
                <SettingText>
                  <SettingName>Mascaramento de documento</SettingName>
                  <SettingHint>Oculte parcialmente CPF/CNPJ em listagens não administrativas.</SettingHint>
                </SettingText>
                <Switch $enabled aria-label="Mascaramento de documento habilitado" />
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingName>Arquivo de retenção</SettingName>
                  <SettingHint>Mova registros antigos para armazenamento de arquivo após inatividade.</SettingHint>
                </SettingText>
                <StatusPill>24 meses</StatusPill>
              </SettingRow>
            </SettingList>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelIcon>
                <Globe />
              </PanelIcon>
              <div>
                <PanelTitle>Operações Regionais</PanelTitle>
                <PanelDescription>Controle padrões usados ​​por equipes agrícolas distribuídas.</PanelDescription>
              </div>
            </PanelHeader>
            <SettingList>
              <SettingRow>
                <SettingText>
                  <SettingName>Localidade primária</SettingName>
                  <SettingHint>Formatação de números, datas e exportações de relatórios.</SettingHint>
                </SettingText>
                <StatusPill>pt-BR</StatusPill>
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingName>Módulo operacional padrão</SettingName>
                  <SettingHint>Visualização de destino para gerentes após fazer login.</SettingHint>
                </SettingText>
                <StatusPill>Painel</StatusPill>
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingName>Marca de campo</SettingName>
                  <SettingHint>Exiba a identidade Brain Agriculture em todo o espaço de trabalho.</SettingHint>
                </SettingText>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.primary, fontWeight: 700 }}>
                  <Tractor size={16} />
                  Ativo
                </div>
              </SettingRow>
            </SettingList>
          </Panel>
        </Grid>
      </PageContainer>
    </AppLayout>
  )
}