import React, { useState, useEffect, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const eventTypes = [
  { label: 'All Event Types', value: null },
  { label: 'Children\'s Events', value: 'children' },
  { label: 'Sport Events', value: 'sport' },
  { label: 'Cultural Events', value: 'cultural' },
  { label: 'Social Gatherings', value: 'social' },
  { label: 'Educational Programs', value: 'educational' },
];

const statusFilters = [
  { label: 'All Events', value: 'all' },
  { label: 'Past Events', value: 'past' },
  { label: 'Ongoing Now', value: 'current' },
  { label: 'Upcoming', value: 'upcoming' },
];

const EventSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const handleSearch = useCallback(() => {
    onSearch({
      search: searchTerm.trim(),
      from: fromDate ? fromDate.toISOString().split('T')[0] : '',
      to: toDate ? toDate.toISOString().split('T')[0] : '',
      type: selectedType || '',
      status: statusFilter,
    });
  }, [searchTerm, fromDate, toDate, selectedType, statusFilter, onSearch]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleReset = () => {
    setSearchTerm('');
    setFromDate(null);
    setToDate(null);
    setSelectedType(null);
    setStatusFilter('all');
    onSearch({});
  };

  return (
    <div className="bg-white  rounded-xl shadow-xl p-6 mb-6   mx-auto">
      {/* Main Search Row */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Search Field - Dominant */}
        <div className="flex-1 w-full">
          <label htmlFor="event-search" className="block text-sm  mb-1">
            Search Events
          </label>
          <div className="relative">
            <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <InputText
              id="event-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter keywords, titles, or descriptions..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Search Button */}
        <Button
          icon="pi pi-search"
          label="Search"
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors w-full md:w-auto"
          onClick={handleSearch}
        />
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Date Range</label>
          <div className="flex gap-2">
            <Calendar
              value={fromDate}
              onChange={(e) => setFromDate(e.value)}
              placeholder="Start Date"
              className="w-full p-2 border border-gray-300 rounded-lg"
              showIcon
              icon="pi pi-calendar"
              dateFormat="dd/mm/yy"
            />
            <Calendar
              value={toDate}
              onChange={(e) => setToDate(e.value)}
              placeholder="End Date"
              className="w-full p-2 border border-gray-300 rounded-lg"
              showIcon
              icon="pi pi-calendar"
              dateFormat="dd/mm/yy"
            />
          </div>
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Event Type</label>
          <Dropdown
            value={selectedType}
            options={eventTypes}
            onChange={(e) => setSelectedType(e.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Event Status</label>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={classNames(
                  'px-3 py-1.5 text-sm rounded-full transition-all',
                  {
                    'bg-blue-600 text-white': statusFilter === filter.value,
                    'bg-gray-100 text-gray-700 hover:bg-gray-200': statusFilter !== filter.value,
                  }
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <i className="pi pi-refresh" />
          Reset all filters
        </button>
      </div>
    </div>
  );
};

export default EventSearchBar;