
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
      .replace(/\*(.*?)\*/g, '<em>$1</em>')     
      .replace(/(\r\n|\n|\r)/g, '<br />');       

    return { __html: html };
  };

  return <div dangerouslySetInnerHTML={renderMarkdown(content)} />;
};
