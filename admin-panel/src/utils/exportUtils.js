export const exportToCSV = (data, fileName) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]).join(',');
  const csvRows = data.map(row => {
    return Object.values(row).map(value => {
      // If value is an array (like invoice items), format it nicely
      if (Array.isArray(value)) {
        value = value.map(item => {
          if (typeof item === 'object' && item !== null) {
            // For invoice items, try to get PartName and Quantity
            const name = item.partName || item.name || 'Item';
            const qty = item.quantity || '';
            return qty ? `${name} (x${qty})` : name;
          }
          return item;
        }).join('; ');
      }
      
      // Escape commas and wrap in quotes
      const escaped = ('' + (value ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',');
  });

  const csvContent = [headers, ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toLocaleDateString()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
