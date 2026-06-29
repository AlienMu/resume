const formatSalaryRange = (record = {}) => {
  if (record.salaryRangeShow) return record.salaryRangeShow;
  if (record.salaryRange) return record.salaryRange;
  const min = record.salaryMin ?? record.salaryMinK;
  const max = record.salaryMax ?? record.salaryMaxK;
  if (min != null && max != null) {
    return `${min}-${max}`;
  }
  if (min != null) return `${min}+`;
  if (max != null) return `${max}-`;
  return '--';
};

const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value) return [value];
  return [];
};

export const buildJobSearchQuery = (form = {}) => {
  const query = {};
  Object.entries(form).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query[key] = value;
    }
  });
  return query;
};
