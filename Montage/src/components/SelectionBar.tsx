import { observer } from 'mobx-react-lite';

const SelectionBar= observer(() => {
  const availableModels = [
    { name: 'Model 1', url: '/assets/Annex_tag.glb' },
    { name: 'Model 2', url: '/assets/Lifestyle_tag.glb' },
    { name: 'Model 3', url: '/assets/Dwelling_tag.glb' },
  ];

  const handleDragStart = (e: React.DragEvent, url: string) => {
    e.dataTransfer.setData('text/plain', url);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">Available Models</h3>
      <ul>
        {availableModels.map((model, index) => (
          <li
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, model.url)}
            className="p-2 mb-2 bg-white border border-gray-200 rounded-md cursor-grab hover:bg-gray-100"
          >
            {model.name}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default SelectionBar
