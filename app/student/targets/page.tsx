'use client';

import { useRouter } from 'next/navigation';
import { SMARTTargetCard } from '@/components/targets/SMARTTargetCard';
import { useStudentProgress } from '@/lib/hooks/useStudentProgress';

export default function TargetsPage() {
  const router = useRouter();
  const progress = useStudentProgress();

  if (!progress) {
    return (
      <div className="p-4">
        <p>Loading...</p>
      </div>
    );
  }

  const targets = progress.targets;

  const handleEdit = (targetId: string) => {
    // Future: open edit modal or navigate to edit page
    console.log('Edit target:', targetId);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Back"
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">My Goals</h1>
          <p className="text-sm text-text-secondary mt-1">
            {targets.length} {targets.length === 1 ? 'target' : 'targets'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            // Future: open add target modal
            console.log('Add target');
          }}
          aria-label="Add target"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gatsby text-white rounded-lg hover:bg-gatsby-dark font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Target
        </button>
      </div>

      {/* Target List */}
      {targets.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-text-secondary">No targets yet</p>
          <p className="text-sm text-text-secondary mt-1">
            Add your first SMART target to start tracking your goals
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {targets.map((target) => (
            <SMARTTargetCard
              key={target.id}
              target={target}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
