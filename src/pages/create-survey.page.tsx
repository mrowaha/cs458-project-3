import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
//import { Checkbox } from "@/components/ui/checkbox" // Removed problematic import
import { Plus, Trash2, GripVertical, List, Star, Text, CheckCircle, Radio, XCircle, ArrowLeft } from 'lucide-react'; //added ArrowLeft
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { useNavigate } from "react-router";

// Types
type QuestionType = 'multipleChoice' | 'ratingScale' | 'openEnded' | 'dropdown' | 'checkboxes';

interface Question {
    id: string;
    type: QuestionType;
    title: string;
    options?: string[]; // For multiple choice, dropdown, and checkboxes
    scale?: number;     // For rating scale
    required: boolean;
    condition?: {
        questionId: string;
        answer: string | string[]; // support multiple answers for condition
    };
}

interface Survey {
    id: string;
    title: string;
    questions: Question[];
}

// Animation Variants
const questionVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

// Helper Components
const DraggableHandle = () => (
    <div className="flex items-center cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-gray-500" />
    </div>
);

const QuestionHeader = ({
    question,
    onDelete,
    index,
    isDragging,
}: {
    question: Question;
    onDelete: (id: string) => void;
    index: number;
    isDragging?: boolean;
}) => (
    <div
        className={cn(
            "flex items-center justify-between gap-4 p-2 bg-gray-200 rounded-md",
            "border border-gray-300",
            isDragging ? "opacity-50" : ""
        )}
    >
        <div className="flex items-center gap-2">
            <DraggableHandle />
            <span className="text-sm font-medium text-gray-700">
                Question {index + 1}
            </span>
            <span className="text-xs text-gray-500">
                ({question.type === 'multipleChoice' && 'Multiple Choice'}
                {question.type === 'ratingScale' && 'Rating Scale'}
                {question.type === 'openEnded' && 'Open Ended'}
                {question.type === 'dropdown' && 'Dropdown'}
                {question.type === 'checkboxes' && 'Checkboxes'})
            </span>
        </div>

        <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(question.id)}
            className="text-gray-600 hover:text-red-500"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    </div>
);

const QuestionBody = ({
    question,
    onChange,
    onOptionChange,
    onOptionAdd,
    onOptionDelete,
}: {
    question: Question;
    onChange: (id: string, updates: Partial<Question>) => void;
    onOptionChange: (questionId: string, optionIndex: number, newValue: string) => void;
    onOptionAdd: (questionId: string) => void;
    onOptionDelete: (questionId: string, optionIndex: number) => void;
}) => {
    const renderOptions = () => {
        if (!question.options) return null;

        return (
            <div className="space-y-2">
                {question.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input
                            value={option}
                            onChange={(e) =>
                                onOptionChange(question.id, index, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 bg-white border-gray-300 text-gray-900"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOptionDelete(question.id, index)}
                            className="text-gray-600 hover:text-red-500"
                        >
                            <XCircle className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOptionAdd(question.id)}
                    className="mt-2 text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                </Button>
            </div>
        );
    };

    const renderScale = () => {
        if (!question.scale) return null;

        return (
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Scale:</span>
                <Select
                    value={question.scale.toString()}
                    onValueChange={(value) =>
                        onChange(question.id, { scale: parseInt(value, 10) })
                    }
                >
                    <SelectTrigger className="w-[120px] bg-white border-gray-300 text-gray-900">
                        <SelectValue placeholder="Select scale" />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-100 border-gray-300'>
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((scale) => (
                            <SelectItem key={scale} value={scale.toString()} className="hover:bg-gray-200 text-gray-900">
                                {scale}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    };

    return (
        <div className="space-y-4 p-4 bg-gray-100 rounded-md">
            <div>
                <Label htmlFor={`question-title-${question.id}`} className="text-sm font-medium block mb-1 text-gray-700">
                    Question Title
                </Label>
                <Textarea
                    id={`question-title-${question.id}`}
                    value={question.title}
                    onChange={(e) => onChange(question.id, { title: e.target.value })}
                    placeholder="Enter your question here..."
                    className="w-full bg-white border-gray-300 text-gray-900"
                />
            </div>

            {question.type === 'multipleChoice' && renderOptions()}
            {question.type === 'dropdown' && renderOptions()}
            {question.type === 'checkboxes' && renderOptions()}
            {question.type === 'ratingScale' && renderScale()}
        </div>
    );
};

const ConditionalLogicInput = ({
    question,
    allQuestions,
    onChange,
}: {
    question: Question;
    allQuestions: Question[];
    onChange: (id: string, updates: Partial<Question>) => void;
}) => {
    const [selectedQuestion, setSelectedQuestion] = useState<string>(
        question.condition?.questionId || ''
    );
    const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>(
        question.condition?.answer || ''
    );
    const [conditionActive, setConditionActive] = useState<boolean>(!!question.condition);

    const sourceQuestion = allQuestions.find((q) => q.id === selectedQuestion);

    const handleQuestionChange = (value: string) => {
        setSelectedQuestion(value);
        // Reset answer when question changes
        setSelectedAnswer('');
        if (value) {
            onChange(question.id, {
                condition: {
                    questionId: value,
                    answer: '', // Reset answer
                },
            });
        } else {
            onChange(question.id, { condition: undefined }); // remove condition
        }
    };

    const handleAnswerChange = (value: string | string[]) => {
      setSelectedAnswer(value);
        if (selectedQuestion) {
            onChange(question.id, {
                condition: {
                    questionId: selectedQuestion,
                    answer: value,
                },
            });
        }
    };

    const toggleCondition = (checked: boolean) => {
        setConditionActive(checked);
        if (checked && selectedQuestion && selectedAnswer) { // Only set if both question and answer are selected
          onChange(question.id, {
                condition: {
                    questionId: selectedQuestion,
                    answer: selectedAnswer,
                },
            });
        } else {
            onChange(question.id, { condition: undefined });
        }
    };

    return (
        <div className="space-y-4 p-4 bg-gray-100 rounded-md border border-gray-300">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id={`condition-toggle-${question.id}`}
                    checked={conditionActive}
                    onChange={(e) => toggleCondition(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor={`condition-toggle-${question.id}`} className="text-sm font-medium text-gray-700">
                    Conditional Logic
                </Label>
            </div>

            {conditionActive && (
                <div className="space-y-4">
                    <div>
                        <Label htmlFor={`condition-question-${question.id}`} className="text-sm font-medium block mb-1 text-gray-700">
                            Show this question if the answer to question:
                        </Label>
                        <Select
                            value={selectedQuestion}
                            onValueChange={handleQuestionChange}
                            disabled={!conditionActive}
                        >
                            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900">
                                <SelectValue placeholder="Select a question" />
                            </SelectTrigger>
                            <SelectContent className='bg-gray-100 border-gray-300'>
                                {allQuestions
                                    .filter((q) => q.id !== question.id) // Exclude current question
                                    .map((q) => (
                                        <SelectItem key={q.id} value={q.id} className="hover:bg-gray-200 text-gray-900">
                                            Question {allQuestions.indexOf(q) + 1}: {q.title}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedQuestion && sourceQuestion && (
                        <div>
                            <Label className="text-sm font-medium block mb-1 text-gray-700">
                                is answered with:
                            </Label>
                            {sourceQuestion.type === 'multipleChoice' && (
                                <Select
                                    value={selectedAnswer as string}
                                    onValueChange={(value) => handleAnswerChange(value)}
                                    disabled={!conditionActive}
                                >
                                    <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select an answer" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-gray-100 border-gray-300'>
                                        {sourceQuestion.options?.map((option, index) => (
                                            <SelectItem key={index} value={option} className="hover:bg-gray-200 text-gray-900">
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            {sourceQuestion.type === 'dropdown' && (
                                <Select
                                  value={selectedAnswer as string}
                                  onValueChange={(value) => handleAnswerChange(value)}
                                  disabled={!conditionActive}
                                >
                                    <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select an answer" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-gray-100 border-gray-300'>
                                        {sourceQuestion.options?.map((option, index) => (
                                            <SelectItem key={index} value={option} className="hover:bg-gray-200 text-gray-900">
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            {sourceQuestion.type === 'checkboxes' && (
                                <div className="space-y-2">
                                    {sourceQuestion.options?.map((option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`checkbox-answer-${question.id}-${index}`}
                                                checked={Array.isArray(selectedAnswer) && selectedAnswer.includes(option)}
                                                onChange={(e) => {
                                                  let newAnswer: string[];
                                                  if (Array.isArray(selectedAnswer)) {
                                                    newAnswer = [...selectedAnswer];
                                                  } else {
                                                    newAnswer = [];
                                                  }

                                                  if (e.target.checked) {
                                                    newAnswer.push(option);
                                                  } else {
                                                    newAnswer = newAnswer.filter((a) => a !== option);
                                                  }
                                                  handleAnswerChange(newAnswer.length > 0 ? newAnswer : ''); // Ensure '' is passed if no options
                                                }}
                                                className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                                                disabled={!conditionActive}
                                            />
                                            <Label htmlFor={`checkbox-answer-${question.id}-${index}`} className="text-sm text-gray-700">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {sourceQuestion.type === 'ratingScale' && (
                                <Select
                                  value={selectedAnswer as string}
                                  onValueChange={(value) => handleAnswerChange(value)}
                                  disabled={!conditionActive}
                                >
                                    <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select a rating" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-gray-100 border-gray-300'>
                                        {Array.from({ length: sourceQuestion.scale || 5 }, (_, i) => i + 1).map((scale) => (
                                            <SelectItem key={scale} value={scale.toString()}  className="hover:bg-gray-200 text-gray-900">
                                                {scale}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            {sourceQuestion.type === 'openEnded' && (
                                <Input
                                    value={selectedAnswer as string}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                    placeholder="Enter the expected answer"
                                    disabled={!conditionActive}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const QuestionIcon = ({ type }: { type: QuestionType }) => {
    switch (type) {
        case 'multipleChoice':
            return <Radio className="w-4 h-4 text-gray-500" />;
        case 'ratingScale':
            return <Star className="w-4 h-4 text-gray-500" />;
        case 'openEnded':
            return <Text className="w-4 h-4 text-gray-500" />;
        case 'dropdown':
            return <List className="w-4 h-4 text-gray-500" />;
        case 'checkboxes':
            return <CheckCircle className="w-4 h-4 text-gray-500" />;
        default:
            return null;
    }
};

const SurveyEditor = () => {
    const [survey, setSurvey] = useState<Survey>({
        id: crypto.randomUUID(),
        title: 'Untitled Survey',
        questions: [],
    });
    const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null);

    const navigate = useNavigate();
    
    const navigateToDashboard = () => {
        navigate('/dashboard');
    };


    
    // --- Question Management ---
    const addQuestion = (type: QuestionType) => {
        const newQuestion: Question = {
            id: crypto.randomUUID(),
            type,
            title: '',
            required: false,
            ...(type === 'multipleChoice' && { options: ['', ''] }), // Initialize with 2 empty options
            ...(type === 'dropdown' && { options: ['', ''] }),
            ...(type === 'checkboxes' && { options: ['', ''] }),
            ...(type === 'ratingScale' && { scale: 5 }), // Default scale
        };
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: [...prevSurvey.questions, newQuestion],
        }));
    };

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: prevSurvey.questions.map((q) =>
                q.id === id ? { ...q, ...updates } : q
            ),
        }));
    };

    const deleteQuestion = (id: string) => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: prevSurvey.questions.filter((q) => q.id !== id),
        }));
    };

    const addOption = (questionId: string) => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: prevSurvey.questions.map((q) =>
                q.id === questionId
                    ? { ...q, options: [...(q.options || []), ''] }
                    : q
            ),
        }));
    };

    const updateOption = (questionId: string, optionIndex: number, newValue: string) => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: prevSurvey.questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: (q.options || []).map((option, index) =>
                            index === optionIndex ? newValue : option
                        ),
                    }
                    : q
            ),
        }));
    };

    const deleteOption = (questionId: string, optionIndex: number) => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: prevSurvey.questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: (q.options || []).filter((_, index) => index !== optionIndex),
                    }
                    : q
            ),
        }));
    };

    const handleDragStart = (questionId: string) => {
        setDraggedQuestionId(questionId);
    };

    const handleDragEnd = () => {
        setDraggedQuestionId(null);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
        event.preventDefault();

        if (draggedQuestionId === null) return;

        setSurvey((prevSurvey) => {
            const { questions } = prevSurvey;
            const draggedIndex = questions.findIndex((q) => q.id === draggedQuestionId);

            // Create a new array to avoid mutating the original directly
            const newQuestions = [...questions];
            // Remove the dragged question
            const [draggedQuestion] = newQuestions.splice(draggedIndex, 1);
            // Insert the dragged question at the new position
            newQuestions.splice(targetIndex, 0, draggedQuestion);

            return { ...prevSurvey, questions: newQuestions };
        });
        setDraggedQuestionId(null);
    };

    // --- Render ---
    return (
        <div className="min-h-screen bg-gray-200 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Survey Editor</h1>
                    <Button
                        variant="ghost"
                        onClick={navigateToDashboard}
                        className="text-gray-700 hover:text-blue-600"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
                <Input
                    value={survey.title}
                    onChange={(e) => setSurvey(prev => ({...prev, title: e.target.value}))}
                    placeholder="Enter Survey Title"
                    className="mt-4 mx-auto w-full max-w-md bg-white border-gray-300 text-gray-900"
                />
                <div className="space-y-4">
                    <AnimatePresence>
                        {survey.questions.map((question, index) => (
                            <motion.div
                                key={question.id}
                                variants={questionVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                draggable
                                onDragStart={() => handleDragStart(question.id)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                className={cn(
                                    "space-y-4",
                                    draggedQuestionId === question.id && "opacity-50"
                                )}
                            >
                                <QuestionHeader
                                    question={question}
                                    onDelete={deleteQuestion}
                                    index={index}
                                    isDragging={draggedQuestionId === question.id}
                                />
                                <QuestionBody
                                    question={question}
                                    onChange={updateQuestion}
                                    onOptionChange={updateOption}
                                    onOptionAdd={addOption}
                                    onOptionDelete={deleteOption}
                                />
                                <ConditionalLogicInput
                                    question={question}
                                    allQuestions={survey.questions}
                                    onChange={updateQuestion}
                                />
                                <div className="p-4 bg-gray-100 rounded-md flex items-center gap-2"> 
                                    <input // replaced Checkbox
                                        type="checkbox"
                                        id={`required-${question.id}`}
                                        checked={question.required}
                                        onChange={(e) =>
                                            updateQuestion(question.id, { required: e.target.checked })
                                        }
                                        className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor={`required-${question.id}`} className="text-sm font-medium text-gray-700">
                                        Required
                                    </Label>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Add Question Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => addQuestion('multipleChoice')}
                        className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-100"
                    >
                        <QuestionIcon type="multipleChoice" />
                        Multiple Choice
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => addQuestion('ratingScale')}
                        className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-100"
                    >
                        <QuestionIcon type="ratingScale" />
                        Rating Scale
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => addQuestion('openEnded')}
                        className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-100" 
                    >
                         <QuestionIcon type="openEnded" />
                        Open Ended
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => addQuestion('dropdown')}
                        className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-100"
                    >
                        <QuestionIcon type="dropdown" />
                        Dropdown
                    </Button>
                     <Button
                        variant="outline"
                        onClick={() => addQuestion('checkboxes')}
                        className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-100"
                    >
                        <QuestionIcon type="checkboxes" />
                        Checkboxes
                    </Button>
                </div>
                <div className='mt-8 flex justify-center'>
                    <Button variant='default' size='lg' className="bg-blue-600 hover:bg-blue-700 text-white">
                        Save Survey
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SurveyEditor;

