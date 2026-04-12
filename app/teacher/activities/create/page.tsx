'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GATSBY_BENCHMARKS = [
  { id: 'GB1', name: 'Careers Programme' },
  { id: 'GB2', name: 'Labour Market' },
  { id: 'GB3', name: 'Individual Needs' },
  { id: 'GB4', name: 'Curriculum Links' },
  { id: 'GB5', name: 'Employer Encounters' },
  { id: 'GB6', name: 'Work Experience' },
  { id: 'GB7', name: 'Education Pathways' },
  { id: 'GB8', name: 'Personal Guidance' },
];

const ASDAN_UNITS = [
  { id: '', name: 'None (Optional)' },
  { id: 'ASDAN-CA1', name: 'Career Awareness 1' },
  { id: 'ASDAN-CA2', name: 'Career Awareness 2' },
  { id: 'ASDAN-WR1', name: 'Work Readiness 1' },
  { id: 'ASDAN-WR2', name: 'Work Readiness 2' },
  { id: 'ASDAN-PS1', name: 'Personal Skills 1' },
];

const EVIDENCE_TYPES = [
  { id: 'photo', name: 'Photo', description: 'Upload a photo as evidence' },
  { id: 'voice', name: 'Voice Recording', description: 'Record audio evidence' },
  { id: 'document', name: 'Document', description: 'Upload a document or PDF' },
];

export default function CreateActivityPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>([]);
  const [asdanUnitId, setAsdanUnitId] = useState('');
  const [evidenceTypes, setEvidenceTypes] = useState<string[]>(['photo']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleBenchmark = (benchmarkId: string) => {
    setSelectedBenchmarks((prev) =>
      prev.includes(benchmarkId)
        ? prev.filter((id) => id !== benchmarkId)
        : [...prev, benchmarkId]
    );
  };

  const toggleEvidenceType = (typeId: string) => {
    setEvidenceTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSubmit = async (saveAsDraft: boolean) => {
    if (!name.trim() || selectedBenchmarks.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/teacher/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          gatsbyBenchmarkIds: selectedBenchmarks,
          asdanUnitId: asdanUnitId || null,
          evidenceTypes,
          status: saveAsDraft ? 'draft' : 'active',
        }),
      });

      if (response.ok) {
        router.push('/teacher/activities');
      }
    } catch (error) {
      console.error('Failed to create activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Create Activity</h1>
        <p className="text-text-secondary mt-1">
          Create a new activity linked to Gatsby benchmarks
        </p>
      </div>

      <div className="space-y-6">
        {/* Activity Name */}
        <div>
          <label
            htmlFor="activity-name"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Activity Name
          </label>
          <input
            type="text"
            id="activity-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Career Research Project"
            className="w-full px-4 py-2 rounded-lg border border-border-default bg-surface-card text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-persona-teacher focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe what students will do..."
            className="w-full px-4 py-2 rounded-lg border border-border-default bg-surface-card text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-persona-teacher focus:border-transparent resize-none"
          />
        </div>

        {/* Gatsby Benchmarks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-text-primary">
              Gatsby Benchmarks
            </label>
            <span className="text-xs text-text-secondary">
              Select at least one benchmark
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {GATSBY_BENCHMARKS.map((benchmark) => (
              <label
                key={benchmark.id}
                htmlFor={`benchmark-${benchmark.id}`}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedBenchmarks.includes(benchmark.id)
                    ? 'border-gatsby bg-gatsby/5'
                    : 'border-border-default bg-surface-card hover:bg-surface-page'
                }`}
              >
                <input
                  type="checkbox"
                  id={`benchmark-${benchmark.id}`}
                  checked={selectedBenchmarks.includes(benchmark.id)}
                  onChange={() => toggleBenchmark(benchmark.id)}
                  className="w-4 h-4 text-gatsby border-border-default rounded focus:ring-gatsby"
                />
                <div>
                  <span className="text-sm font-medium text-gatsby">{benchmark.id}</span>
                  <span className="text-sm text-text-primary ml-2">{benchmark.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* ASDAN Unit */}
        <div>
          <label
            htmlFor="asdan-unit"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            ASDAN Unit (Optional)
          </label>
          <select
            id="asdan-unit"
            value={asdanUnitId}
            onChange={(e) => setAsdanUnitId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-border-default bg-surface-card text-text-primary focus:outline-none focus:ring-2 focus:ring-persona-teacher focus:border-transparent"
          >
            {ASDAN_UNITS.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>

        {/* Evidence Requirements */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Evidence Requirements
          </label>
          <div className="space-y-2">
            {EVIDENCE_TYPES.map((type) => (
              <label
                key={type.id}
                htmlFor={`evidence-${type.id}`}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  evidenceTypes.includes(type.id)
                    ? 'border-persona-teacher bg-persona-teacher/5'
                    : 'border-border-default bg-surface-card hover:bg-surface-page'
                }`}
              >
                <input
                  type="checkbox"
                  id={`evidence-${type.id}`}
                  checked={evidenceTypes.includes(type.id)}
                  onChange={() => toggleEvidenceType(type.id)}
                  className="w-4 h-4 mt-0.5 text-persona-teacher border-border-default rounded focus:ring-persona-teacher"
                />
                <div>
                  <div className="text-sm font-medium text-text-primary">{type.name}</div>
                  <div className="text-xs text-text-secondary">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border-default">
          <Link
            href="/teacher/activities"
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </Link>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting || !name.trim() || selectedBenchmarks.length === 0}
              className="px-4 py-2 border border-border-default text-text-primary rounded-lg hover:bg-surface-page transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || !name.trim() || selectedBenchmarks.length === 0}
              className="px-4 py-2 bg-persona-teacher text-white rounded-lg hover:bg-persona-teacher/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
