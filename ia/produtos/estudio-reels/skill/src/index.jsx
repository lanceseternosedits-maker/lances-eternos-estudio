// Entrada do Remotion. Cada cenário é uma composição 1080×1920 a 30 quadros/s;
// a duração vem do projeto preparado (scripts/preparar.py), passado com --props=projetos/<nome>.json.
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { Contagem } from './Contagem';
import { Cidade } from './Cidade';
import exemploContagem from '../roteiros/exemplo_contagem.preparado.json';
import exemploCidade from '../roteiros/exemplo_cidade.preparado.json';

const duracao = ({ props }) => ({ durationInFrames: Math.max(30, Math.ceil((props.total || 10) * 30)) });

const Raiz = () => (<>
  <Composition id="Contagem" component={Contagem} defaultProps={exemploContagem} calculateMetadata={duracao} fps={30} width={1080} height={1920} durationInFrames={300} />
  <Composition id="Cidade" component={Cidade} defaultProps={exemploCidade} calculateMetadata={duracao} fps={30} width={1080} height={1920} durationInFrames={300} />
</>);

registerRoot(Raiz);
