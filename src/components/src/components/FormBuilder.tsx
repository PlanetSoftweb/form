import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormStore } from '../store/formStore';
import { useAuthStore } from '../store/authStore';
import { FormElement } from './FormElement';
import { Toolbox } from './Toolbox';
import { StyleEditor } from './StyleEditor';
import { FormPreview } from './FormPreview';
import { SubmissionsView } from './SubmissionsView';
import { 
  Save, 
  Eye, 
  Settings, 
  LayoutDashboard, 
  Loader2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  BarChart2
} from 'lucide-react';
import toast from 'react-hot-toast';
import useUndo from 'use-undo';

export const FormBuilder = () => {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentForm, fetchForm, saveForm, updateForm } = useFormStore();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab');
    return tab === 'submissions' ? 'submissions' : 'editor';
  });
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [zoom, setZoom] = useState(100);

  // Initialize undo/redo state for elements
  const [
    elementsState,
    { 
      set: setElements,
      reset: resetElements,
      undo: undoElements,
      redo: redoElements,
      canUndo,
      canRedo,
    },
  ] = useUndo<any[]>([]);

  const elements = elementsState.present;

  const [style, setStyle] = useState({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#3b82f6',
    borderRadius: '0.5rem',
    fontFamily: 'Inter, system-ui, sans-serif',
  });

  useEffect(() => {
    const loadForm = async () => {
      if (formId) {
        const form = await fetchForm(formId);
        if (form) {
          setFormTitle(form.title);
          setFormDescription(form.description || '');
          setElements(form.elements);
          setStyle(form.style);
        }
      }
      setLoading(false);
    };
    loadForm();
  }, [formId]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'submissions') {
      setActiveTab('submissions');
    }
  }, [searchParams]);

  const handleSave = async () => {
    try {
      setSaving(true);
      if (!formTitle.trim()) {
        toast.error('Please enter a form title');
        return;
      }

      if (!user) {
        toast.error('You must be logged in to save forms');
        return;
      }

      const formData = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        elements,
        style,
        userId: user.uid,
      };

      if (formId) {
        await updateForm(formId, formData);
      } else {
        const newFormId = await saveForm(formData);
        navigate(`/builder/${newFormId}`);
      }
      toast.success('Form saved successfully');
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = elements.findIndex((e) => e.id === active.id);
      const newIndex = elements.findIndex((e) => e.id === over.id);
      const newElements = arrayMove(elements, oldIndex, newIndex);
      setElements(newElements);
    }
  };

  const addElement = (element: any) => {
    const newElement = { ...element, id: crypto.randomUUID() };
    setElements([...elements, newElement]);
    toast.success(`Added ${element.type} element`);
  };

  const removeElement = (id: string) => {
    setElements(elements.filter((element) => element.id !== id));
    toast.success('Element removed');
  };

  const updateElement = (id: string, updates: Partial<any>) => {
    setElements(elements.map((element) => 
      element.id === id ? { ...element, ...updates } : element
    ));
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 50));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'submissions') {
      navigate(`/builder/${formId}?tab=submissions`);
    } else {
      navigate(`/builder/${formId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
              <input
                type="text"
                placeholder="Form Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-xl font-semibold bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              {/* Undo/Redo Controls */}
              <button
                onClick={undoElements}
                disabled={!canUndo}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                title="Undo"
              >
                <Undo2 className="h-5 w-5" />
              </button>
              <button
                onClick={redoElements}
                disabled={!canRedo}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                title="Redo"
              >
                <Redo2 className="h-5 w-5" />
              </button>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-2 border-l border-r px-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-600">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  title="Zoom In"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
              </div>

              {/* View Controls */}
              <button
                onClick={() => handleTabChange('editor')}
                className={`p-2 rounded-lg ${
                  activeTab === 'editor' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleTabChange('preview')}
                className={`p-2 rounded-lg ${
                  activeTab === 'preview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowStyleEditor(!showStyleEditor)}
                className={`p-2 rounded-lg ${
                  showStyleEditor ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Settings className="h-5 w-5" />
              </button>

              {/* Submissions Button */}
              {formId && (
                <button
                  onClick={() => handleTabChange('submissions')}
                  className={`p-2 rounded-lg ${
                    activeTab === 'submissions' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title="View Submissions"
                >
                  <BarChart2 className="h-5 w-5" />
                </button>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Save className="h-5 w-5 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {activeTab !== 'submissions' && (
          <div className="w-80 bg-white border-r overflow-y-auto">
            <Toolbox onAddElement={addElement} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          {activeTab === 'submissions' ? (
            <SubmissionsView formId={formId!} elements={elements} />
          ) : (
            <div 
              className="max-w-4xl mx-auto"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              {activeTab === 'editor' ? (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={elements} strategy={verticalListSortingStrategy}>
                    {elements.map((element) => (
                      <FormElement
                        key={element.id}
                        element={element}
                        onRemove={removeElement}
                        onUpdate={updateElement}
                        style={style}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              ) : (
                <FormPreview
                  title={formTitle}
                  description={formDescription}
                  elements={elements}
                  style={style}
                  onSubmit={async (responses) => {
                    console.log('Preview submission:', responses);
                    toast.success('This is a preview. Submissions are disabled.');
                  }}
                />
              )}
            </div>
          )}
        </div>

        {showStyleEditor && activeTab !== 'submissions' && (
          <div className="w-80 bg-white border-l overflow-y-auto">
            <StyleEditor style={style} onChange={setStyle} />
          </div>
        )}
      </div>
    </div>
  );
};