export default function enemyBehavior(enemy){
  const rig = document.querySelector('#rig');
  if (!rig) return;

  // Check if enemy has nav-agent component
  if (!enemy.components['nav-agent']) {
    console.warn('Enemy does not have nav-agent component');
    return;
  }

  const rigPos = rig.object3D.position;
  
  // Set the player's position as the destination for the nav-agent
  // The nav-agent will automatically pathfind along the navmesh
  enemy.setAttribute('nav-agent', {
    destination: `${rigPos.x} ${rigPos.y} ${rigPos.z}`,
    active: true
  });
}
