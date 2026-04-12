'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useStudentHeatmap } from '@/lib/hooks/useStudentHeatmap';

function getStatusColour(percentComplete: number): string {
  if (percentComplete === 0) return 'bg-gray-100 dark:bg-gray-800';
  if (percentComplete < 25) return 'bg-red-100 dark:bg-red-900/30';
  if (percentComplete < 50) return 'bg-orange-100 dark:bg-orange-900/30';
  if (percentComplete < 75) return 'bg-yellow-100 dark:bg-yellow-900/30';
  if (percentComplete < 100) return 'bg-green-100 dark:bg-green-900/30';
  return 'bg-green-200 dark:bg-green-800/50';
}

function getTextColour(percentComplete: number): string {
  if (percentComplete === 0) return 'text-gray-400';
  if (percentComplete < 25) return 'text-red-700 dark:text-red-300';
  if (percentComplete < 50) return 'text-orange-700 dark:text-orange-300';
  if (percentComplete < 75) return 'text-yellow-700 dark:text-yellow-300';
  return 'text-green-700 dark:text-green-300';
}

export default function StudentsPage() {
  const heatmap = useStudentHeatmap();
  const [showAddModal, setShowAddModal] = useState(false);

  if (!heatmap) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-persona-teacher" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Students</h1>
          <p className="text-text-secondary mt-1">
            {heatmap.summary.totalStudents} students • {heatmap.summary.averageCompletion}% average completion
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-persona-teacher text-white rounded-lg hover:bg-persona-teacher/90 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Student
        </button>
      </div>

      {/* Heatmap Table */}
      <div className="bg-surface-card rounded-xl border border-border-default overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default bg-surface-page">
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                  Student
                </th>
                {['GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'].map((gb) => (
                  <th
                    key={gb}
                    className="px-3 py-3 text-center text-sm font-medium text-gatsby"
                  >
                    {gb}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-sm font-medium text-text-secondary">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {heatmap.students.map((student) => (
                <tr key={student.studentId} className="hover:bg-surface-page/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/teacher/students/${student.studentId}`}
                      className="text-sm font-medium text-text-primary hover:text-persona-teacher"
                    >
                      {student.displayName}
                    </Link>
                  </td>
                  {student.benchmarks.map((benchmark) => (
                    <td
                      key={benchmark.benchmarkId}
                      className={`px-3 py-3 text-center ${getStatusColour(benchmark.percentComplete)}`}
                      role="cell"
                    >
                      <span className={`text-xs font-medium ${getTextColour(benchmark.percentComplete)}`}>
                        {benchmark.percentComplete > 0 ? `${benchmark.percentComplete}%` : '-'}
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-text-primary">
                      {student.overallPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800" />
          <span>Not started</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30" />
          <span>&lt;25%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-100 dark:bg-orange-900/30" />
          <span>25-49%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100 dark:bg-yellow-900/30" />
          <span>50-74%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30" />
          <span>75-99%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-200 dark:bg-green-800/50" />
          <span>Complete</span>
        </div>
      </div>

      {/* Add Student Modal - Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-card rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Add Student</h2>
            <p className="text-text-secondary mb-4">Coming soon...</p>
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-surface-page text-text-primary rounded-lg hover:bg-surface-page/80"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
