import { registerRoot, Composition, AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
const Teste = () => { const f = useCurrentFrame(); return (<AbsoluteFill style={{ background: '#eee9e1', justifyContent: 'center', alignItems: 'center', fontSize: 120, fontFamily: 'sans-serif' }}>
  <div style={{ opacity: interpolate(f, [0, 20], [0, 1]), transform: `scale(${interpolate(f, [0, 30], [0.8, 1], { extrapolateRight: 'clamp' })})` }}>IA em 60s</div></AbsoluteFill>); };
const Root = () => <Composition id="Teste" component={Teste} durationInFrames={30} fps={30} width={1080} height={1920} />;
registerRoot(Root);
