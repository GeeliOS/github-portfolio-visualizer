import React, { useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FaChartPie, FaChartBar, FaCode, FaTable } from 'react-icons/fa';

const LanguageCharts = ({ repositories }) => {
  const [activeTab, setActiveTab] = useState('pie'); // 'pie', 'bar', 'table'

  // Подсчет статистики по языкам
  const languageStats = useMemo(() => {
    if (!repositories || repositories.length === 0) {
      return { 
        pieData: [], 
        barData: [], 
        totalRepos: 0,
        reposWithLanguage: 0,
        reposWithoutLanguage: 0
      };
    }

    const languageCount = {};
    let reposWithLanguage = 0;
    let reposWithoutLanguage = 0;

    repositories.forEach(repo => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        reposWithLanguage++;
      } else {
        reposWithoutLanguage++;
      }
    });

    const totalRepos = repositories.length;

    // Преобразуем в массив для графиков
    let statsArray = Object.entries(languageCount).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / totalRepos) * 100).toFixed(1),
      absolutePercentage: ((value / totalRepos) * 100).toFixed(1)
    }));

    // Добавляем "Без языка", если есть такие репозитории
    if (reposWithoutLanguage > 0) {
      statsArray.push({
        name: 'No Language',
        value: reposWithoutLanguage,
        percentage: ((reposWithoutLanguage / totalRepos) * 100).toFixed(1),
        absolutePercentage: ((reposWithoutLanguage / totalRepos) * 100).toFixed(1)
      });
    }

    // Сортируем по количеству (по убыванию)
    statsArray.sort((a, b) => b.value - a.value);

    // Ограничиваем количество для читаемости, остальное группируем в "Other"
    const maxDisplay = 8;
    let pieData, barData;

    if (statsArray.length > maxDisplay) {
      const mainLanguages = statsArray.slice(0, maxDisplay - 1);
      const otherLanguages = statsArray.slice(maxDisplay - 1);
      const otherTotal = otherLanguages.reduce((sum, lang) => sum + lang.value, 0);
      const otherPercentage = ((otherTotal / totalRepos) * 100).toFixed(1);

      pieData = [
        ...mainLanguages,
        {
          name: 'Other',
          value: otherTotal,
          percentage: otherPercentage,
          absolutePercentage: otherPercentage
        }
      ];

      barData = [
        ...mainLanguages,
        {
          name: 'Other',
          value: otherTotal,
          percentage: otherPercentage,
          absolutePercentage: otherPercentage
        }
      ];
    } else {
      pieData = statsArray;
      barData = statsArray;
    }

    return {
      pieData,
      barData,
      statsArray, // Все данные для таблицы
      totalRepos,
      reposWithLanguage,
      reposWithoutLanguage
    };
  }, [repositories]);

  // Цвета для языков
  const languageColors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C#': '#178600',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Vue': '#2c3e50',
    'React': '#61dafb',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Dart': '#00B4AB',
    'Shell': '#89e051',
    'PowerShell': '#012456',
    'SCSS': '#c6538c',
    'Less': '#1d365d',
    'No Language': '#6e7681',
    'Other': '#8b949e'
  };

  // Получение цвета для языка
  const getColor = (languageName) => {
    return languageColors[languageName] || '#58a6ff';
  };

  // Кастомный тултип для PieChart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          padding: '12px',
          borderRadius: '6px',
          minWidth: '180px'
        }}>
          <p style={{ margin: '0 0 5px 0', color: '#f0f6fc', fontWeight: 'bold' }}>
            {data.name}
          </p>
          <p style={{ margin: '0 0 3px 0', color: '#c9d1d9' }}>
            Репозиториев: <strong style={{ color: '#58a6ff' }}>{data.value}</strong>
          </p>
          <p style={{ margin: 0, color: '#8b949e' }}>
            {data.percentage}% от всех репозиториев
          </p>
        </div>
      );
    }
    return null;
  };

  // Кастомные метки для PieChart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent > 0.03) {
      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12}
          fontWeight="bold"
          style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)' }}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }
    return null;
  };

  if (!repositories || repositories.length === 0) {
    return null;
  }

  const { pieData, barData, statsArray, totalRepos, reposWithLanguage, reposWithoutLanguage } = languageStats;

  if (pieData.length === 0) {
    return (
      <div className="no-data">
        <p>Нет данных о языках программирования</p>
      </div>
    );
  }

  return (
    <div className="language-charts-section">
      <h2 className="section-title">
        <FaChartPie /> Распределение языков программирования
        <span className="repo-count-badge">({totalRepos} репозиториев)</span>
      </h2>
      
      {/* Общая статистика */}
      <div className="language-overview-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaCode />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalRepos}</div>
            <div className="stat-label">Всего репозиториев</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-info">
            <div className="stat-value">{reposWithLanguage}</div>
            <div className="stat-label">С указанным языком</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaChartPie />
          </div>
          <div className="stat-info">
            <div className="stat-value">{reposWithoutLanguage}</div>
            <div className="stat-label">Без языка</div>
          </div>
        </div>
      </div>
      
      {/* Вкладки для переключения между диаграммами */}
      <div className="charts-tabs">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'pie' ? 'active' : ''}`}
            onClick={() => setActiveTab('pie')}
          >
            <FaChartPie /> Круговая диаграмма
          </button>
          <button 
            className={`tab-button ${activeTab === 'bar' ? 'active' : ''}`}
            onClick={() => setActiveTab('bar')}
          >
            <FaChartBar /> Столбчатая диаграмма
          </button>
          <button 
            className={`tab-button ${activeTab === 'table' ? 'active' : ''}`}
            onClick={() => setActiveTab('table')}
          >
            <FaTable /> Таблица
          </button>
        </div>
        
        <div className="tab-content">
          {/* Круговая диаграмма */}
          {activeTab === 'pie' && (
            <div className="chart-wrapper">
              <div className="chart-header">
                <h3><FaChartPie /> Круговая диаграмма</h3>
                <p className="chart-description">Визуализация распределения языков по количеству репозиториев</p>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{
                        paddingLeft: '20px',
                        fontSize: '14px'
                      }}
                      formatter={(value) => <span style={{ color: '#c9d1d9' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {/* Столбчатая диаграмма */}
          {activeTab === 'bar' && (
            <div className="chart-wrapper">
              <div className="chart-header">
                <h3><FaChartBar /> Столбчатая диаграмма</h3>
                <p className="chart-description">Количество репозиториев по языкам программирования</p>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={barData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#c9d1d9"
                      tick={{ 
                        fill: '#c9d1d9',
                        fontSize: 11, // Уменьшен размер шрифта
                        fontWeight: 500 
                      }}
                      angle={-45}
                      textAnchor="end"
                      height={80} // Увеличена высота для наклонного текста
                      interval={0} // Показывать все подписи
                      padding={{ left: 10, right: 10 }} // Отступы слева и справа
                    />
                    <YAxis 
                      stroke="#8b949e"
                      tick={{ fill: '#8b949e' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '6px'
                      }}
                      labelStyle={{ color: '#f0f6fc', fontWeight: 'bold', marginBottom: '5px' }}
                      formatter={(value, name, props) => [
                        `${value} репозиториев (${props.payload.percentage}%)`,
                        'Количество'
                      ]}
                    />

                    <Bar 
                      dataKey="value" 
                      name="Репозитории"
                      radius={[4, 4, 0, 0]}
                    >
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {/* Таблица */}
          {activeTab === 'table' && (
            <div className="table-wrapper">
              <div className="table-header">
                <h3><FaTable /> Таблица языков программирования</h3>
                <p className="chart-description">Детальная статистика по всем языкам</p>
              </div>
              <div className="table-content">
                <div className="language-stats-table">
                  <div className="stats-table-header">
                    <span className="header-language">Язык программирования</span>
                    <span className="header-count">Количество репозиториев</span>
                    <span className="header-percentage">Процент от общего числа</span>
                  </div>
                  <div className="stats-grid">
                    {statsArray.map((lang, index) => (
                      <div key={index} className="language-stat-item">
                        <div className="language-info">
                          <div className="language-color" style={{ backgroundColor: getColor(lang.name) }}></div>
                          <span className="language-name">{lang.name}</span>
                        </div>
                        <span className="language-count">{lang.value}</span>
                        <span className="language-percentage">{lang.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageCharts;
