# Tech Stack Visualizer

An interactive 3D map of a technology stack — layers (infrastructure, data,
backend, frontend, users) stacked as levels, with nodes connected across
layers to show how pieces of a system depend on each other. Click any node
to open a detail panel with its description, tags, and connections.

Built with React, TypeScript, [react-three-fiber](https://docs.pmnd.rs/react-three-fiber)
and [drei](https://github.com/pmndrs/drei).

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL. Drag to orbit the camera, scroll to zoom,
and click a sphere to inspect that piece of the stack.

## Customizing the stack

All content lives in [`src/data/stackData.ts`](src/data/stackData.ts):

- `layers` — the horizontal levels (id, label, color, height on the Y axis).
- `nodes` — individual technologies/components, each assigned to a layer,
  with a description, tags, and a list of connected node ids.

Edit that file to model your own stack (or a company's, for due-diligence
notes) — the 3D layout and connections are generated automatically from it.

## Roadmap ideas

- Per-node custom visualizations (e.g. live metrics, architecture diagrams)
  instead of the placeholder connection gauge.
- Search/filter nodes by tag or layer.
- Save/share a stack configuration as JSON.
- Animated data-flow particles along the connection lines.
